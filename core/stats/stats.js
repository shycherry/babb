var $ = global.$
var _ = global._
var Backbone = global.Backbone
var Fs = require('fs')

/*
* events : none
*/

var StatsModel = Backbone.Model.extend({
  defaults: {    
    totalTime : "-",
    nbLaunched : "-",
    averageTime : "-",
    lastLaunchDate : "-",
    firstLaunchDate : "-",    
    baseStatsDirectory : "./stats",
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
  
  updateStats : function(){
    if(this.rom && this.platform){
      var statsFilename = this.get('baseStatsDirectory')+'/'+this.platform.get('name')+'_'+this.rom.get('title')+'.txt'
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
      
        this.set('totalTime', this.defaults.totalTime)
        this.set('nbLaunched', this.defaults.nbLaunched)
        this.set('averageTime', this.defaults.averageTime)
        this.set('lastLaunchDate', this.defaults.lastLaunchDate)
        this.set('firstLaunchDate', this.defaults.firstLaunchDate)
        console.log('no stats db file found :(')
      }
    }
  },
  
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
    this.model.on('change', this.render)    
  },
  
  setPlatform : function(iPlatform){
    this.model.setPlatform(iPlatform)
    this.render()
  },
  
  setRom : function(iRom){
    this.model.setRom(iRom)
    this.render()
  }, 
  
  render : function(){
    this.$el.html(this.template({stats : this.model}))
  }
})

exports.StatsView = StatsView