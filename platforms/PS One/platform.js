var config = require('./config').config
var emulatorPath = config.emulatorPath
var romsPaths = config.romsPaths

exports.getName = function(){
  return config.displayName
}

exports.getLogoPath = function(){
  return __dirname+'/images/logo.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return Fs.existsSync(emulatorPath)
}

exports.romsProvider = function(parReport, oRomsCollection){
  var Roms = global.BABB.Libs.Roms
  var Path = require('path')
  var FilenamesFilter = global.BABB.Libs.FilenamesFilter
  
  var filteredFilesMap = new FilenamesFilter(parReport)
      .keepFilesWithExtensions(config.romsExtensions)
      .onlyKeepBasename()
      .removeExtensions()
      .get()

  for(var locPath in filteredFilesMap){
    var rom = new Roms.Rom()
    rom.set({
      id : rom.cid,
      title : filteredFilesMap[locPath],
      path : locPath
    })
    oRomsCollection.add(rom)
  }
  
}

exports.runRom = function (parRom){  
  if(parRom){  
    var selectedRomPath = parRom.get('path')
    if(selectedRomPath){
      var Spawner = global.BABB.Libs.Spawner
      var Path = require('path')
      Spawner.spawn(
        emulatorPath, 
        ['-nogui','-loadbin', selectedRomPath], 
        {cwd : Path.dirname(emulatorPath)}
      )
      
    }
  }  
}
