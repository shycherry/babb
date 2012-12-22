
function doSniff(){
  var Sniffer = require('./directory_sniffer');
  var snifferInput = $(global.BABB.ServicesConfig.manualSnifferInputId);  
  Sniffer.stopSniff();
  Sniffer.sniff([snifferInput.val()]);
}

function doSpawn(command){
  var spawner = require('./spawner');
  spawner.spawn(command);
}

exports.doSniff = doSniff;
exports.doSpawn = doSpawn;
