var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Path = require('path')
var Fs = require('fs')
var Sniffer = BABB.coreRequire('sniffer')
var Roms = BABB.coreRequire('roms')
var Launchers = BABB.coreRequire('launchers')
var LauncherMapper = BABB.coreRequire('launcherMapper')
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
  _launchers : null,

  initialize: function Platform(){
    this.set('id', this.cid)

    _.bindAll(this,'_defaultRomsProvider')

    this.findLaunchers();

    if(this.getPlatformConfig().platformName){
      this.set('name', this.getPlatformConfig().platformName)
    }

    if(this.getPlatformConfig().viewName){
      this.set('viewName', this.getPlatformConfig().viewName)
    }
  },

  findLaunchers : function(){
    var self = this
    self._launchers = new Launchers.LaunchersCollection()
    var platformDir = self.get('path')
    var localEntries = Fs.readdirSync(platformDir)

    localEntries.forEach(function(iDirectoryEntryName){
      var pathResolved = Path.join(platformDir, iDirectoryEntryName)
      var requireLauncherPath = pathResolved+Path.sep+'launcher.js'

      if(Fs.existsSync(requireLauncherPath)){
        var launcherFile = require(pathResolved+Path.sep+'launcher.js')

        if(launcherFile && launcherFile.Launcher){
          var launcher = new launcherFile.Launcher({path:pathResolved})
          if(launcher){
            self._launchers.add(launcher)
          }
        }

      }

    })

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

    // ioRomsCollection.comparator = function(iRom1, iRom2){
    //   if( iRom1.get('title') < iRom2.get('title')){
    //     return -1
    //   }else if ( iRom1.get('title') > iRom2.get('title')){
    //     return 1
    //   }else{
    //     return 0
    //   }
    // }

    var filteredFilesMap = this.getFilteredFilesMap(parReport)

    for(var locPath in filteredFilesMap){
      var rom = new Roms.Rom({
        title : filteredFilesMap[locPath],
        path : locPath
      })
      ioRomsCollection.add(rom)
    }

  },

  getLauncherFromName : function(iRunnerName){
    return this._launchers.where({name:iRunnerName})[0]
  },

  getNextLauncher : function(iRom){
    var currentLauncher = this.getLauncher(iRom)
    var currentLauncherIdx = this._launchers.lastIndexOf(currentLauncher)
    var nextLauncherIdx = (currentLauncherIdx+1) % this._launchers.size()
    return this._launchers.at(nextLauncherIdx)
  },

  getLauncher : function(iRom){
    var mappedLauncher = LauncherMapper.getLauncher(iRom, this)

    if(!mappedLauncher){
      var defaultLauncherName = this.getPlatformConfig().defaultLauncherName
      if(defaultLauncherName)
        mappedLauncher = this.getLauncherFromName(defaultLauncherName)
    }

    if(!mappedLauncher)
      mappedLauncher = this._launchers.at(0)

    return mappedLauncher
  },

  isAvailable : function (){
    var isThereAtLeastOneLauncherAvailable = false

    for(var i = 0; i<= this._launchers.length; i++){
      if(this._launchers.at(i).isAvailable){
        isThereAtLeastOneLauncherAvailable = true
        break
      }
    }

    return isThereAtLeastOneLauncherAvailable
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
