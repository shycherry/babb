var Fs = require('fs');
var watchers = {};

function Map(){
  this.globalId = 0;
  this.idToKeys = {};
  this.idToValues = {};
  
  this.add = function(parKey, parValue){    
    this.idToKeys[this.globalId] = parKey;
    this.idToValues[this.globalId] = parValue;
    this.globalId++;
  };
  
  this.remove = function(parKey){
    var keyId = this.findId(this.idToKeys, parKey);
    delete(this.idToValues[keyId]);
    delete(this.idToKeys[keyId]);    
  };
  
  this.getValueFromKey = function(parKey){
    var keyId = this.findId(this.idToKeys, parKey);
    return this.idToValues[keyId];
  };
  
  this.getKeyFromValue = function(parValue){
    var valueId = this.findId(this.idToValues, parValue)
    return this.idToKeys[valueId];
  };
  
  this.findId = function(collection, Item){
    var id = -1;
    for(var i in collection){
      if(collection[i] == Item){
        id = i;
        break;
      }
    }    
    return id;
  };   
};

var pathsToCallbacksMap = new Map();
var callbacksToPathsMap = new Map();


var SniffedDirectoryRepport = function () {};

function sniff(parPathsToSniff, parCallback){
  for (var i in parPathsToSniff){
    var currentPath = parPathsToSniff[i];
    if(Fs.existsSync(currentPath)){
      
      if( ! pathsToCallbacksMap.getValueFromKey(currentPath)){
        pathsToCallbacksMap.add(currentPath, []);
      }
      pathsToCallbacksMap.getValueFromKey(currentPath).push(parCallback);
      
      if( ! callbacksToPathsMap.getValueFromKey(parCallback)){
        callbacksToPathsMap.add(parCallback,[]);
      }
      callbacksToPathsMap.getValueFromKey(parCallback).push(currentPath);
    }    
  }  
  startSniff(parCallback);
}

function readDirectoryCollection(parCallback){  
  var paths = callbacksToPathsMap.getValueFromKey(parCallback);  
  var locReport = new SniffedDirectoryRepport();
  
  for(var i in paths){
    var currentPath = paths[i];
    Fs.readdir(currentPath,
      (function(path, report, callback){
        return function(err, files){
          handleDirectory(err, files, path, report, callback);
        };
      })(currentPath, locReport, parCallback)
    );    
  }
}

function handleDirectory(err, files, path, report, callback){
  if( ! report[path]){
    report[path] = [];
  }
  for(var i in files){
    report[path].push(files[i]);
  }  
  callback(report);
}

function startSniff(parCallback){  
  readDirectoryCollection(parCallback);
  var paths = callbacksToPathsMap.getValueFromKey(parCallback);
  for(var i in paths){
    var watcher = Fs.watch(paths[i], function(event, filename){
      console.log('event:'+event+' for filename:'+filename);
      readDirectoryCollection(parCallback);
    });

    if(watcher){
      watchers[paths[i]] = watcher;
    }
  }
  
}

function stopSniff(parPaths){
  for(var i in parPaths){    
    var path = parPaths[i];    
    var callbacks = pathsToCallbacksMap.getValueFromKey(path);
    
    for(var j in callbacks){
      var currentCallback = callbacks[j];
      if(currentCallback){
        callbacks.pop(currentCallback);
        callbacksToPathsMap.remove(currentCallback);
      }
    }
    pathsToCallbacksMap.remove(path);
    
    if(watchers[path]){
      watchers[path].close();
      delete(watchers[path]);
    }
  }
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;
