var mamePath = 'C:\\Users\\Vincent\\Downloads\\mame\\mame64.exe'
var romsPaths = ["c:\\"]

exports.getName = function(){
  return 'MAME'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.runRom = function (parRom){
  if(parRom){
    var selectedRomPath = parRom.get('path');
    if(selectedRomPath){      
      var Spawner = require('../../js/spawner');
      var Path = require('path');
      Spawner.spawn(
        mamePath, 
        ['-rp', Path.dirname(selectedRomPath), parRom.get('title')],
        {cwd : Path.dirname(mamePath)}
      );        
    }
  }  
}


