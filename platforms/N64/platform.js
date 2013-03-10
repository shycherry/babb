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

exports.runRom = function (iPlatform, iRom){  
  if(iRom){
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){
      var Spawner = global.BABB.Utils.Spawner
      var Path = require('path')
      var selectedRomPathArgs = selectedRomPath.trim().split(' ')
      Spawner.spawn(
        emulatorPath, 
        selectedRomPathArgs,
        {cwd : Path.dirname(emulatorPath)},
        iPlatform,
        iRom
      )        
    }
  }  
}
