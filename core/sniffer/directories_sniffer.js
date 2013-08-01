var Fs = require('fs')
var Path = require('path')
var watchers = {}

function Map(){
  this.globalId = 0
  this.idToKeys = {}
  this.idToValues = {}

  this.add = function(parKey, parValue){
    this.idToKeys[this.globalId] = parKey
    this.idToValues[this.globalId] = parValue
    this.globalId++
  }

  this.remove = function(parKey){
    var keyId = this.findId(this.idToKeys, parKey)

    delete(this.idToValues[keyId])
    delete(this.idToKeys[keyId])
  }

  this.getKeyFromId = function(parId){
    return this.idToKeys[parId]
  }

  this.getValueFromKey = function(parKey){
    var keyId = this.findId(this.idToKeys, parKey)
    return this.idToValues[keyId]
  }

  this.getKeyFromValue = function(parValue){
    var valueId = this.findId(this.idToValues, parValue)
    return this.idToKeys[valueId]
  }

  this.keyExists = function(parKey){
    return ( !! this.getValueFromKey(parKey))
  }

  this.getKeyId = function(parKey){
    return this.findId(this.idToKeys, parKey)
  }

  this.findId = function(collection, Item){
    var id = -1
    for(var i in collection){
      if(collection[i] == Item){
        id = i
        break
      }
    }
    return id
  }
}

var pathsToCallbacksMap = new Map()
var callbacksToPathsMap = new Map()


function sniff(parPathsToSniff, parCallback){
  for (var i in parPathsToSniff){
    var currentPath = parPathsToSniff[i]
    if( !Fs.existsSync(currentPath) ){
      currentPath = Path.resolve(currentPath)
    }
    if(Fs.existsSync(currentPath)){

      if( ! pathsToCallbacksMap.keyExists(currentPath)){
        pathsToCallbacksMap.add(currentPath, [])
      }
      pathsToCallbacksMap.getValueFromKey(currentPath).push(parCallback)

      if( ! callbacksToPathsMap.keyExists(parCallback)){
        callbacksToPathsMap.add(parCallback,[])
      }
      callbacksToPathsMap.getValueFromKey(parCallback).push(currentPath)
    }
  }
  startSniff(parCallback)
}

function readDirectoryCollection(parCallback){
  var paths = callbacksToPathsMap.getValueFromKey(parCallback)
  var callbackId = callbacksToPathsMap.getKeyId(parCallback)

  var readdirCallback = function(path, callbackId){
    return function(err, files){
      handleDirectory(err, files, path, callbackId)
    }
  }

  for(var i in paths){
    var currentPath = paths[i]
    Fs.readdir(currentPath, (readdirCallback)(currentPath, callbackId) )
  }
}

function handleDirectory(err, files, path, callbackId){
  var report = {}
  report[path] = []
  for(var i in files){
    report[path].push(files[i])
  }
  var callback = callbacksToPathsMap.getKeyFromId(callbackId)
  if(callback){
    callback(report)
  }
}

function startSniff(parCallback){
  readDirectoryCollection(parCallback)
  var paths = callbacksToPathsMap.getValueFromKey(parCallback)

  var watchCallback = function(event, filename){
    BABB.log('event:'+event+' for filename:'+filename)
    parCallback({isUpdate : true})
  }

  for(var i in paths){
    var watcher = Fs.watch(paths[i], watchCallback)
    if(watcher){
      watchers[paths[i]] = watcher
    }
  }

}

function stopSniff(parPaths){
  for(var i in parPaths){
    var path = parPaths[i]
    var callbacks = pathsToCallbacksMap.getValueFromKey(path)

    for(var j in callbacks){
      var currentCallback = callbacks[j]
      if(currentCallback){
        callbacks.pop(currentCallback)
        callbacksToPathsMap.remove(currentCallback)
      }
    }
    pathsToCallbacksMap.remove(path)

    if(watchers[path]){
      watchers[path].close()
      delete(watchers[path])
    }
  }
}

exports.sniff = sniff
exports.stopSniff = stopSniff
