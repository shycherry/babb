var mamePath = 'C:/Users/Vincent/Desktop/Emulateur/mame/mame64.exe'
var romsPaths = ["C:/Users/Vincent/Desktop/Roms/MAME"]
var history = require('./history')

history.loadHistory()

exports.getName = function(){
  return 'MAME'
}

exports.getLogoPath = function(){
  return __dirname+'/images/8364-haveac00kie-Mame.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return Fs.existsSync(mamePath)
}

exports.runRom = function (iRom){
  if(iRom){
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){      
      var Spawner = global.BABB.Libs.Spawner
      var Path = require('path')
      Spawner.spawn(
        mamePath, 
        ['-rp', Path.dirname(selectedRomPath), iRom.get('title')],
        {cwd : Path.dirname(mamePath)}
      )        
    }
  }  
}


