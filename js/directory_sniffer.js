var Fs = require('fs');
var Path = require('path');
var Roms = require('./roms');

var watchers = {};

var multiRomsCollection = new Roms.RomsCollection();
var multiRomsCollectionView = new Roms.RomsCollectionView({collection : multiRomsCollection});

var locPathsToSniff = null;

function sniff(pathsToSniff){
  locPathsToSniff = pathsToSniff;
  
  refillCollections();
  startSniff();
  
  return multiRomsCollection;
}

function refillCollections(){
  
  multiRomsCollection.reset();
  
  locPathsToSniff.forEach(function(pathToSniff){
    Fs.readdir(pathToSniff,function(err, files){
      for(var i in files){
        var rom = new Roms.Rom();
        rom.set({id:rom.cid});
        var filenameParts = Path.basename(files[i]).split('.');
        rom.set({title:filenameParts[0]});
        var pathNormalized = Path.join(pathToSniff,files[i]);
        pathNormalized = Path.normalize(pathNormalized);
        rom.set({path : pathNormalized});
        multiRomsCollection.add(rom);
      }
    });
  });
}

function startSniff(){
  locPathsToSniff.forEach(function(pathToSniff){
    var watcher = Fs.watch(pathToSniff, function(event, filename){
      console.log('event:'+event+' for filename:'+filename);
      refillCollections(locPathsToSniff);
    });

    if(watcher){
      watchers[pathToSniff] = watcher;
    }
  });
}

function stopSniff(){
  //multiRomsCollectionView.unbind();
  locPathsToSniff=null;
  
  for(var path in watchers){
    watchers[path].close();
    delete(watchers[path]);
  }
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;