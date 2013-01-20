var mamePath = 'notepad.exe'
var romsPaths = [__dirname+'/Roms']

exports.getName = function(){
  return 'Dummy'
}

exports.getLogoPath = function(){
  return __dirname+'/images/8364-haveac00kie-Mame.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return true
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


