var Config = global.BABB.ConfigShadowConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')


var preparePath = function(iPath){
  if( ! Fs.existsSync(Config.savePath)){
    Fs.mkdirSync(Config.savePath)
  }
  if( ! Fs.existsSync(iPath)){
    Fs.mkdirSync(iPath)
  }
  
}

exports.save = function(iRom, iPlatform){
  var savePath = Config.savePath
  if(iRom && iPlatform){
    savePath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
  }
  preparePath(savePath)
}

exports.restore = function(iRom, iPlatform){
  
}

