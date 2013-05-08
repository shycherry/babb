var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Path = require('path')
var Fs = require('fs')
var Sniffer = BABB.coreRequire('sniffer')
var Roms = BABB.coreRequire('roms')

var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView

var Platform = Backbone.Model.extend({
  defaults: {    
    id : "x",
    name : "unammed platform",
    path : "/default/path",
    viewName : BABB.PlatformsConfig.defaultViewName,
  },
  
  platformConfig : null,
  
  initialize: function Platform(){    
    this.set('id', this.cid)    
    
    _.bindAll(this,'defaultRomsProvider')
    
    if(this.getPlatformConfig().displayName){
      this.set('name', this.getPlatformConfig().displayName)
    }

    if(this.getPlatformConfig().viewName){
      this.set('viewName', this.getPlatformConfig().viewName)
    }
  },

  getPlatformConfig : function(){    
    if(!this.platformConfig){
      var configPath = Path.normalize(this.get('path')+'/config')
      if(Fs.existsSync(configPath)){
        this.platformConfig = require(configPath).PlatformConfig
      }else{
        this.platformConfig = {}
      }
    }
    return this.platformConfig
  },
  
  getLogoPath : function(){
    if(this.getPlatformConfig().logoPath){
      return this.getPlatformConfig().logoPath
    }else{
      return this.get('path')+Path.sep+'logo.png'
    }
  },
  
  getRomsPaths : function(){
    if(this.getPlatformConfig().romsPaths){
      return this.getPlatformConfig().romsPaths
    }
    return []
  },
  
  getRomsProvider: function(){    
    return this.defaultRomsProvider
  },
  
  getShadowConfig: function(){
    if(this.getPlatformConfig().ShadowConfig){
      return this.getPlatformConfig().ShadowConfig
    }
    return null
  },
  
  defaultRomsProvider : function(parReport, ioRomsCollection){  
    var FilenamesFilter = global.BABB.Utils.FilenamesFilter  
    var filteredFilesMap = new FilenamesFilter(parReport)
        .keepFilesWithExtensions(this.getPlatformConfig().romsExtensions)
        .onlyKeepBasename()
        .removeExtensions()
        .get()

    for(var locPath in filteredFilesMap){
      var rom = new Roms.Rom({
        title : filteredFilesMap[locPath],
        path : locPath
      })    
      ioRomsCollection.add(rom)
    }
    
  },
    
  runRom : function (iPlatform, iRom){
    console.log('using default runRom')
    if(iRom){  
      var emulatorPath = this.getPlatformConfig().emulatorPath
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')
        Spawner.spawn(
          emulatorPath, 
          [selectedRomPath], 
          {cwd : Path.dirname(emulatorPath)},
          iPlatform,
          iRom
        )      
      }
    }  
  },
  
  isAvailable : function (){    
    var emulatorPath = this.platformConfig.emulatorPath
    return Fs.existsSync(emulatorPath)
  },
  
  toString: function(){
    return this.get('name')+' ('+this.get('path')+')'
  }
})

var PlatformsCollection = Backbone.Collection.extend({
  model: Platform,
  initialize: function(){    
  }
})

exports.Platform = Platform
exports.PlatformsCollection = PlatformsCollection
