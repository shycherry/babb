var mamePath = 'notepad.exe'
var execsPaths = [__dirname+'/Execs']

exports.getName = function(){
  return 'Windows'
}

exports.getLogoPath = function(){
  return __dirname+'/logo.png'
}

exports.getRomsPaths = function(){
  return execsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return true
}

exports.runRom = function (iPlatform, iRom){
  if(iRom){
    if(iRom.get('title') == 'Retourner A Windows'){
      process.exit()
    }else{    
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner      
        Spawner.exec(
          selectedRomPath,
          null,
          null,
          iPlatform,
          iRom
        )
      }
    }
  }    
}


