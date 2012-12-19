var fs = require('fs');

var watchers = {};

function sniff(pathsToSniff, onChangeCallback){
    
  pathsToSniff.forEach(function(path){
    var watcher = fs.watch(path, function(event, filename){
      onChangeCallback(filename);
    });
    
    if(watcher){
      watchers[path] = watcher;
    }
  });  
}

function stopSniff(){
  for(var path in watchers){
    watchers[path].close();
    delete(watchers[path]);
  }  
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;