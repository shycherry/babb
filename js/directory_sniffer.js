var Fs = require('fs');
var Path = require('path');
var Roms = require('./roms');

var watchers = {};

var multiRomsCollection = new Roms.RomsCollection();
var multiRomsCollectionView = new Roms.RomsCollectionView({collection : multiRomsCollection});

function sniff(pathsToSniff){

  pathsToSniff.forEach(function(pathToSniff){

    Fs.readdir(pathToSniff,function(err, files){
      for(var i in files){
        var rom = new Roms.Rom(/*{id: i}*/);
        var filenameParts = Path.basename(files[i]).split('.');
        rom.set({title:filenameParts[0]});
        var pathNormalized = Path.join(pathToSniff,files[i]);
        pathNormalized = Path.normalize(pathNormalized);
        rom.set({path : pathNormalized});
        multiRomsCollection.add(rom);
      }
    });

    var watcher = Fs.watch(pathToSniff, function(event, filename){
      console.log('event:'+event+' for filename:'+filename);      
    });

    if(watcher){
      watchers[pathToSniff] = watcher;
    }
  });
  
  return multiRomsCollection;
}

function stopSniff(){
  
  multiRomsCollectionView.unbind();
  //multiRomsCollectionView.remove();
  
  for(var path in watchers){
    watchers[path].close();
    delete(watchers[path]);
  }
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;