var Path = require('path')

function FilenamesFilter(parReport){
  this.map = {}    
  for(var locSniffedPath in parReport){
    var locSniffedFilesArray = parReport[locSniffedPath]    
    for(var i in locSniffedFilesArray){
      var normalizedPath = Path.normalize(Path.join(locSniffedPath, locSniffedFilesArray[i] ))
      this.map[normalizedPath] = normalizedPath
    }    
  }  
}

FilenamesFilter.prototype.keepFilesWithExtensions = function (parExts){
  
  for(var path in this.map){    
    var locExtName = Path.extname(this.map[path])
    if(parExts.indexOf(locExtName) == -1){
      delete this.map[path]
    }
  }
  
  return this
}

FilenamesFilter.prototype.removeFilesWithExtensions = function (parExts){
  
  for(var path in this.map){    
    var locExtName = Path.extname(this.map[path])
    if(parExts.indexOf(locExtName) != -1){
      delete this.map[path]
    }
  }  
    
  return this
}

FilenamesFilter.prototype.removeExtensions = function(){
  for(var path in this.map){    
    var locCurrentName = this.map[path]
    var locExtName = Path.extname(locCurrentName)    
    this.map[path] = locCurrentName.replace(locExtName, '')
  }  
  
  return this
}

FilenamesFilter.prototype.onlyKeepBasename = function(){
  
  for(var path in this.map){        
     this.map[path] = Path.basename(this.map[path])    
  }    
  
  return this
}

FilenamesFilter.prototype.get = function(){
  return this.map
}

exports.FilenamesFilter = FilenamesFilter