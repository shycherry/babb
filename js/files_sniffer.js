var Fs = require('fs');
var Model = require('./Model');
var Path = require('path');

var watchers = {};
var collections = {};

function sniff(pathsToSniff, onChangeCallback){  
  pathsToSniff.forEach(function(pathToSniff){
    var romsCollection = new Model.RomsCollection();
    var romsCollectionView = new Model.RomsCollectionView({collection : romsCollection});
    if(romsCollection){
      collections[pathToSniff] = romsCollectionView;
    }
    
    Fs.readdir(pathToSniff,function(err, files){
      for(var i in files){
        var rom = new Model.Rom({id: i});
        var filenameParts = Path.basename(files[i]).split('.');
        rom.set({title:filenameParts[0]}); 
        var pathNormalized = Path.join(pathToSniff,files[i]);
        pathNormalized = Path.normalize(pathNormalized);
        rom.set({path : pathNormalized}); 
        romsCollection.add(rom);        
      }
    });    
    
    romsCollectionView.render();
    
    var watcher = Fs.watch(pathToSniff, function(event, filename){    
      onChangeCallback(filename);
    });
    
    if(watcher){
      watchers[pathToSniff] = watcher;
    }
  });  
}

function stopSniff(){
  for(var path in collections){
    collections[path].unbind();
    delete(collections[path]);
  }  
  
  for(var path in watchers){
    watchers[path].close();
    delete(watchers[path]);
  }  
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;