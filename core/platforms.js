var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Path = require('path')
var Fs = require('fs')
var Sniffer = BABB.coreRequire('sniffer')
var Roms = BABB.coreRequire('roms')
var FilenamesFilter = BABB.Utils.FilenamesFilter

var _platformsCollection = null

BABB.EventEmitter.on('platformsCollectionChanged', function(iPlatformsCollection){
  _platformsCollection = iPlatformsCollection
})

var Platform = Backbone.Model.extend({
  defaults: {
    id : "x",
    name : "unammed platform",
    path : "/default/path",
    viewName : BABB.PlatformsConfig.defaultViewName
  },

  _platformConfig : null,

  initialize: function Platform(){
    this.set('id', this.cid)

    _.bindAll(this,'_defaultRomsProvider')

    if(this.getPlatformConfig().displayName){
      this.set('name', this.getPlatformConfig().displayName)
    }

    if(this.getPlatformConfig().viewName){
      this.set('viewName', this.getPlatformConfig().viewName)
    }
  },

  getPlatformConfig : function(){
    if(!this._platformConfig){
      var configPath = Path.normalize(this.get('path')+'/config')
      if(Fs.existsSync(configPath)){
        this._platformConfig = require(configPath).PlatformConfig
      }else{
        this._platformConfig = {}
      }
    }
    return this._platformConfig
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
    return this._defaultRomsProvider
  },

  getFilteredFilesMap: function(parReport){
    return new FilenamesFilter(parReport)
        .keepFilesWithExtensions(this.getPlatformConfig().romsExtensions)
        .onlyKeepBasename()
        .removeExtensions()
        .removeTags()
        .tileCase()
        .trim()
        .smartSpaces()
        .get()
  },

  getShadowConfig: function(){
    if(this.getPlatformConfig().ShadowConfig){
      return this.getPlatformConfig().ShadowConfig
    }
    return null
  },

  _defaultRomsProvider : function(parReport, ioRomsCollection){

    var filteredFilesMap = this.getFilteredFilesMap(parReport)

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
    var emulatorPath = this.getPlatformConfig().emulatorPath
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

var getAllPlatformsRomsPathes = function(iFilterNonPlayableOnes){
  var platformsRomsPathes = []
  if(_platformsCollection){
    _platformsCollection.each(function(platform){
      if(platform.getPlatformConfig() ){
        if(iFilterNonPlayableOnes && platform.getPlatformConfig().nonPlayable){
          return
        }
        var platformRomsPathes = platform.getRomsPaths()
        platformRomsPathes.forEach(function(romsPath){
          platformsRomsPathes.push(romsPath)
        })
      }
    })
  }
  return platformsRomsPathes
}

var getAllSniffedPlatforms = function(){
  return _platformsCollection
}

var getPlatformFromName = function(iName){
  return _platformsCollection.where({name: iName})[0]
}

exports.getPlatformFromName = getPlatformFromName
exports.getAllSniffedPlatforms = getAllSniffedPlatforms
exports.getAllPlatformsRomsPathes = getAllPlatformsRomsPathes
exports.Platform = Platform
exports.PlatformsCollection = PlatformsCollection
