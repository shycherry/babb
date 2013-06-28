var BABB = global.BABB
var Platforms = BABB.coreRequire('platforms')
var Roms = BABB.coreRequire('roms')
var BABBPlatform = Platforms.Platform
var Stats = BABB.coreRequire('stats')
var FilenamesFilter = BABB.Utils.FilenamesFilter  

var _statsFiles = null
var _playedPlatforms = null
var _playedPlatformsPathes = null
var _playedPlatformsRomsMap = null
var _playedPathesPlatformsMap = null

var getRomNameFromStatFile = function(iStatFile){
  var posUnderscore = iStatFile.search('_')
  if(posUnderscore == -1){return ''}
  var posExt = iStatFile.search('.txt')
  if(posExt == -1){return ''}
  return iStatFile.substring(posUnderscore+1, posExt)
}

var getPlatformNameFromStatFile = function(iStatFile){
  var posUnderscore = iStatFile.search('_')
  if(posUnderscore == -1){return ''}
  return iStatFile.substring(0, posUnderscore)
}


var updateInternals = function(){
  _statsFiles = Stats.getAllStatsFiles()  
  _playedPlatforms = []
  _playedPlatformsPathes = []
  _playedPlatformsRomsMap = {}
  _playedPathesPlatformsMap = {}

  _statsFiles.forEach(function(statFile){
    var platformName = getPlatformNameFromStatFile(statFile)
    var matchedPlatform = Platforms.getPlatformFromName(platformName)
    if(matchedPlatform){
      if( -1 == _playedPlatforms.lastIndexOf(matchedPlatform)){
        _playedPlatforms.push(matchedPlatform)      
      }
      
      if(!_playedPlatformsRomsMap[platformName]){
        _playedPlatformsRomsMap[platformName] = []
      }
      
      var romName = getRomNameFromStatFile(statFile)
      _playedPlatformsRomsMap[platformName].push(romName)
    }
  })  
  
  _playedPlatforms.forEach(function(platform){
    platform.getRomsPaths().forEach(function(romPath){
      _playedPlatformsPathes.push(romPath)
      if( !_playedPathesPlatformsMap[romPath] ){
        _playedPathesPlatformsMap[romPath] = []
      }
      _playedPathesPlatformsMap[romPath].push(platform)
    })
  })  
}

var statsBasedRomsProvider = function(parReport, ioRomsCollection){  
  
  for(var romPath in parReport){
    var matchedPlatform = _playedPathesPlatformsMap[romPath][0]
    if(matchedPlatform){
      var platformFilteredFilesMap = matchedPlatform.getFilteredFilesMap(parReport)
      var namedRomsIndexed = []
      for(var iPath in platformFilteredFilesMap){
        namedRomsIndexed.push(platformFilteredFilesMap[iPath])
      }
      var playedRoms = _playedPlatformsRomsMap[matchedPlatform.get('name')]
      
      for(var iNamedRom in namedRomsIndexed){
        if( -1 !== playedRoms.lastIndexOf(namedRomsIndexed[iNamedRom])){
          
          var romPath = null
          var iLoop = 0
          for(var locPath in platformFilteredFilesMap){
            if(iLoop == iNamedRom){
              romPath = locPath
              break
            }
            iLoop++
          }
          var rom = new Roms.Rom({
            title : namedRomsIndexed[iNamedRom],
            path : romPath,
            platform : matchedPlatform
          })
          ioRomsCollection.add(rom)
          
        }
      }
    }
  }  
}

exports.Platform = BABBPlatform.extend({
  
  isAvailable : function(){
    return true
  },
  
  runRom : function (iPlatform, iRom){    
  },
  
  getRomsProvider : function(){
    return statsBasedRomsProvider
  },
  
  getRomsPaths : function(){
    updateInternals()
    
    return _playedPlatformsPathes
  },
  
})
