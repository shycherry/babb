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

exports.romsProvider = function(parReport, oRomsCollection){
  var Roms = global.BABB.Libs.Roms
  var Path = require('path')
  var FilenamesFilter = global.BABB.Libs.FilenamesFilter
  
  for(locSniffedPath in parReport){      
    var locSniffedFilesArray = parReport[locSniffedPath]
    var filteredFilesArray = new FilenamesFilter(locSniffedFilesArray)
      .keepFilesWithExtensions(config.romsExtensions)
      .get()
    
    for(var i in filteredFilesArray){
      var locFileName = locSniffedFilesArray[i]    
      var locExtName = Path.extname(locFileName)
      var rom = new Roms.Rom()
      rom.set({id:rom.cid})
      var filename = Path.basename(locFileName).replace(locExtName, '')
      rom.set({title:filename})
      var pathNormalized = Path.join(locSniffedPath,locFileName)
      pathNormalized = Path.normalize(pathNormalized)
      rom.set({path : pathNormalized})    
      oRomsCollection.add(rom)      
    }
  }
   
}

exports.runRome = function (parRom){  
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
