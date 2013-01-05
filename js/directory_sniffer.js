var Fs = require('fs');

var watchers = {};
var callbacks = {};

var SniffedDirectoryRepport = function () {};

function sniff(parPathsToSniff, parCallback){
  for (var i in parPathsToSniff){
    callbacks[parPathsToSniff[i]] = parCallback;
    startSniff(parPathsToSniff[i]);
  }  
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

function startSniff(parPathToSniff){  
  refillCollection(parPathToSniff);
  var watcher = Fs.watch(parPathToSniff, function(event, filename){
    console.log('event:'+event+' for filename:'+filename);
    refillCollection(parPathToSniff);
  });

  if(watcher){
    watchers[parPathToSniff] = watcher;
  }
  
}

function stopSniff(parPaths){
  for(var i in parPaths){
    var path = parPaths[i];
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
