var config = require('./config').config
var project64Path = config.project64Path
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
  return Fs.existsSync(project64Path)
}

exports.runRom = function (iRom){  
  if(iRom){
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){
      var Spawner = global.BABB.Libs.Spawner
      var selectedRomPathArgs = selectedRomPath.trim().split(' ')
      Spawner.spawn(
        project64Path, 
        selectedRomPathArgs
      )        
    }
  }  
}
