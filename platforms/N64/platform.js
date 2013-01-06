var config = require('./config').config;
var project64Path = config.project64Path;
var romsPaths = config.romsPaths;

exports.getName = function(){
  return config.dispayName;
}

exports.getLogoPath = function(){
  return __dirname+'/images/n64_logo_128px_by_breadwrap.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.romsProvider = function(parReport, oRomsCollection){
  var Roms = require(process.cwd()+'/js/roms');  
  var Path = require('path');
  var locSniffedPath = parReport.sniffedPath;
  var locSniffedFilesArray = parReport.sniffedFilesArray;    
  
  for(var i in locSniffedFilesArray){
    var locFileName = locSniffedFilesArray[i];
    if(config.romsExtensions.indexOf(Path.extname(locFileName)) != -1){
      var rom = new Roms.Rom(); 
      rom.set({id:rom.cid});
      var filenameParts = Path.basename(locFileName).split('.');
      rom.set({title:filenameParts[0]});
      var pathNormalized = Path.join(locSniffedPath,locFileName);
      pathNormalized = Path.normalize(pathNormalized);
      rom.set({path : pathNormalized});    
      oRomsCollection.add(rom);
    }
  }
}

exports.runRom = function (parRom){  
  if(parRom){
    var selectedRomPath = parRom.get('path');
    if(selectedRomPath){
      var Spawner = require(process.cwd()+'/js/spawner');
      var selectedRomPathArgs = selectedRomPath.trim().split(' ');
      Spawner.spawn(
        project64Path, 
        selectedRomPathArgs
      );        
    }
  }  
}
