var config = require('./config').config
var emulatorPath = config.emulatorPath
var romsPaths = config.romsPaths

exports.getName = function(){
  return config.displayName
}

exports.getLogoPath = function(){
  return __dirname+'/logo.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return Fs.existsSync(emulatorPath)
}

exports.romsProvider = function(iReport, ioRomsCollection){
  var Roms = global.BABB.Utils.Roms  
  var FilenamesFilter = global.BABB.Utils.FilenamesFilter
  
  var filteredFilesMap = new FilenamesFilter(iReport)
      .keepFilesWithExtensions(config.romsExtensions)
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
}

exports.runRom = function (iRom){  
  if(iRom){  
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){
      var Spawner = global.BABB.Utils.Spawner
      var Path = require('path')
      Spawner.spawn(
        emulatorPath, 
        [selectedRomPath], 
        {cwd : Path.dirname(emulatorPath)}
      )      
    }
  }  
}
