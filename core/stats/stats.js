var $ = global.$
var _ = global._
var Backbone = global.Backbone
var Fs = require('fs')

/*
* events : none
*/

var baseStatsDirectory = "./native_tools/stats"

var StatsModel = Backbone.Model.extend({
  defaults: {
    totalTime : "-",
    nbLaunched : "-",
    averageTime : "-",
    lastLaunchDate : "-",
    firstLaunchDate : "-"
  },

  initialize: function(){
    console.log('Stats init')
    this.set('id', this.cid)
  },

  setPlatform : function(iPlatform){
    if(iPlatform != this.platform){
      this.platform =  iPlatform
      this.updateStats()
    }
  },

  setRom : function(iRom){
    if(iRom != this.rom){
      this.rom = iRom
      this.updateStats()
    }
  },

  getFilename : function(){
    if(this.rom && this.platform){
      return baseStatsDirectory+'/'+this.platform.get('name')+'_'+this.rom.get('title')+'.txt'
    }
    return ''
  },

  getModificationTime : function(){
    var filename = this.getFilename()
    if(Fs.existsSync(filename)){
      return Fs.lstatSync(filename).mtime
    }
  },

  updateStats : function(){
    if(this.rom && this.platform){
      var statsFilename = this.getFilename()
      if(Fs.existsSync(statsFilename)){
        statsStream = Fs.readFileSync(statsFilename).toString()
        var statsArray = statsStream.split('\n')
        var lastLaunchDate = statsArray[3].substr(6,2)+'-'+statsArray[3].substr(4,2)+'-'+statsArray[3].substr(0,4)
        var firstLaunchDate = statsArray[4].substr(6,2)+'-'+statsArray[4].substr(4,2)+'-'+statsArray[4].substr(0,4)
        var averageTime = statsArray[2].substr(0,8)
        var nbLaunched = statsArray[1].substr(0,8)
        var totalTime = statsArray[0].substr(0,8)
        this.set('totalTime', totalTime)
        this.set('nbLaunched', nbLaunched)
        this.set('averageTime', averageTime)
        this.set('lastLaunchDate', lastLaunchDate)
        this.set('firstLaunchDate', firstLaunchDate)

      }else{
        this.set(this.defaults)
      }
    }
  }

})

var StatsView = Backbone.View.extend({

  initialize : function(){
    if(!this.template){
      this.template = _.template(Fs.readFileSync(__dirname+'/default-template.html').toString())
    }
    this.model = new StatsModel()
    this.initBindings()
  },

  initBindings : function(){
    var self = this
    _.bindAll(this, 'render')
    this.model.on('change', _.throttle(this.render, 100))
  },

  setPlatform : function(iPlatform){
    this.model.setPlatform(iPlatform)
  },

  setRom : function(iRom){
    this.model.setRom(iRom)
  },

  forceUpdate : function(iRom, iPlatform){
    this.model.setPlatform(iPlatform)
    this.model.setRom(iRom)
    this.model.updateStats()
    this.render()
  },

  render : function(){
    this.$el.html(this.template({stats : this.model}))
  }
})

var getAllStatsFiles = function(){
  if(Fs.existsSync(baseStatsDirectory))
    return Fs.readdirSync(baseStatsDirectory)
  else
    return []
}

exports.getAllStatsFiles = getAllStatsFiles
exports.StatsView = StatsView
exports.StatsModel = StatsModel
