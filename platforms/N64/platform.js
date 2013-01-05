var project64Path = 'C:/Program Files (x86)/Project64 1.6/Project64.exe'
var romsPaths = ["C:/Users/Vincent/Desktop/Roms/N64"]

exports.getName = function(){
  return 'Nintendo 64'
}

exports.getLogoPath = function(){
  return __dirname+'/images/n64_logo_128px_by_breadwrap.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.runRom = function (parRom){  
  if(parRom){
    var selectedRomPath = parRom.get('path');
    if(selectedRomPath){
      var Spawner = require('../../js/spawner');
      var selectedRomPathArgs = selectedRomPath.trim().split(' ');
      Spawner.spawn(
        project64Path, 
        selectedRomPathArgs
      );        
    }
  }  
}
