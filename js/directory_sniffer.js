var Fs = require('fs');

var watchers = {};
var callbacks = {};

var SniffedDirectoryRepport = function () {};

function sniff(parPathsToSniff, parCallback){
  for (var i in parPathsToSniff){
    callbacks[parPathsToSniff[i]] = parCallback;
  }
  for (var path in parPathsToSniff){
    refillCollection(path);
  }
  startSniff();
}

function notifyDirectoryChanged(pathToSniff, report){
  var callback = callbacks[pathToSniff];
  if(callback){
    callback(report);
  }
}

function refillCollection(parPathToSniff){
  
  Fs.readdir(parPathToSniff,function(err, files){      
    var locReport = new SniffedDirectoryRepport();
    locReport.sniffedPath = parPathToSniff;
    var sniffedFilesArray = [];
    for(var i in files){
      sniffedFilesArray.push(files[i]);        
    }
    locReport.sniffedFilesArray = sniffedFilesArray;      
    notifyDirectoryChanged(parPathToSniff, locReport);
  });
}

function startSniff(){
  for (var pathToSniff in callbacks){
    refillCollection(pathToSniff);
    var watcher = Fs.watch(pathToSniff, function(event, filename){
      console.log('event:'+event+' for filename:'+filename);
      refillCollection(pathToSniff);
    });

    if(watcher){
      watchers[pathToSniff] = watcher;
    }
  };
}

function stopSniff(parPaths){
  for(var path in parPaths){
    if(callbacks[path]){
      delete(callbacks[path]);
    }  
    if(watchers[path]){
      watchers[path].close();
      delete(watchers[path]);
    }
  }
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;
