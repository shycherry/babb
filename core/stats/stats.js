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
        console.log('stats exists !')
        statsStream = Fs.readFileSync(statsFilename).toString()
        var statsArray = statsStream.split('\n')
        this.set('totalTime', statsArray[0])
        this.set('nbLaunched', statsArray[1])
        this.set('averageTime', statsArray[2])        
        this.set('lastLaunchDate', statsArray[3])
        this.set('firstLaunchDate', statsArray[4])
      }else{
        console.log('no stats exists :(')
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