var Roms = require('./roms');
var Path = require('path');

var multiRomsCollection = new Roms.RomsCollection();
var multiRomsCollectionView = new Roms.RomsCollectionView({collection : multiRomsCollection});

function doSniff(){
  var Sniffer = require('./directory_sniffer');
  var snifferInput = $(global.BABB.ServicesConfig.manualSnifferInputId);
  Sniffer.stopSniff();
  Sniffer.sniff([snifferInput.val()], onSniffed);
}

function onSniffed(parRepport){  
  var locSniffedPath = parRepport.sniffedPath;
  var locSniffedFilesArray = parRepport.sniffedFilesArray;
  
  multiRomsCollection.reset();
  for(var i in locSniffedFilesArray){
    var locFileName = locSniffedFilesArray[i];    
    var rom = new Roms.Rom();
    rom.set({id:rom.cid});
    var filenameParts = Path.basename(locFileName).split('.');
    rom.set({title:filenameParts[0]});
    var pathNormalized = Path.join(locSniffedPath,locFileName);
    pathNormalized = Path.normalize(pathNormalized);
    rom.set({path : pathNormalized});    
    multiRomsCollection.add(rom);
  }
}

function doSpawn(command){
  var spawner = require('./spawner');
  spawner.spawn(command);
}

exports.doSniff = doSniff;
exports.doSpawn = doSpawn;
