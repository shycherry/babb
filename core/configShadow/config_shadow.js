﻿var Config = global.BABB.ConfigShadowConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var EventEmitter = global.BABB.EventEmitter


var buildShadowPath = function(iRom, iPlatform){
  var shadowPath = Config.savePath
  if(iRom && iPlatform){
    shadowPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
  }else if(iPlatform){
    shadowPath += Path.sep+'_last_config_'+iPlatform.get('name')
  }
  return shadowPath
}

var preparePath = function(iPath){
  if( ! Fs.existsSync(Config.savePath)){
    Fs.mkdirSync(Config.savePath)
  }
  if( ! Fs.existsSync(iPath)){
    Fs.mkdirSync(iPath)
  }
  
}

exports.save = function(iRom, iPlatform){
  var savePath = buildShadowPath(iRom, iPlatform)
  preparePath(savePath)
}

exports.restore = function(iRom, iPlatform){
  var savePath = buildShadowPath(iRom, iPlatform)
  if(Fs.existsSync(savePath)){
    
  }
}

