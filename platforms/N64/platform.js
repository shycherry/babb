var config = require('./config').config
var project64Path = config.project64Path
var romsPaths = config.romsPaths

exports.getName = function(){
  return config.displayName
}

exports.getLogoPath = function(){
  return __dirname+'/images/n64_logo_128px_by_breadwrap.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.runRom = function (parRom){  
  if(parRom){
    var selectedRomPath = parRom.get('path')
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
