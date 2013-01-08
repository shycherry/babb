var mamePath = 'C:\\Users\\Vincent\\Desktop\\Emulateur\\mame\\mame64.exe'
var romsPaths = ["C:\\Users\\Vincent\\Desktop\\Roms\\MAME"]

exports.getName = function(){
  return 'MAME'
}

exports.getLogoPath = function(){
  return '/images/8364-haveac00kie-Mame.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.runRom = function (parRom){
  if(parRom){
    var selectedRomPath = parRom.get('path');
    if(selectedRomPath){      
      var Spawner = require(process.cwd()+'/js/spawner');
      var Path = require('path');
      Spawner.spawn(
        mamePath, 
        ['-rp', Path.dirname(selectedRomPath), parRom.get('title')],
        {cwd : Path.dirname(mamePath)}
      );        
    }
  }  
}


