var Config = global.BABB.LauncherMapperConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var EventEmitter = global.BABB.EventEmitter


var buildLauncherMapperPath = function(iRom, iPlatform){
  var launcherMapperPath = Config.savePath
  if(iRom && iPlatform){
    launcherMapperPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
  }
  return launcherMapperPath
}

var writeFile = function(iPath, data){
  if( ! Fs.existsSync(Config.savePath)){
    Fs.mkdirSync(Config.savePath)
  }
  Fs.writeFileSync(iPath, data)
}

exports.mapLauncher = function(iRom, iPlatform, iLauncher){
  if(!iPlatform){
    return
  }
  var savePath = buildLauncherMapperPath(iRom, iPlatform)
  writeFile(savePath, iLauncher.get('name'))
}

exports.getLauncher = function(iRom, iPlatform){
  if(!iRom || !iPlatform){
    return
  }
  var savePath = buildLauncherMapperPath(iRom, iPlatform)
  if(Fs.existsSync(savePath)){
    var launcherName = Fs.readFileSync(savePath).toString()
    return iPlatform.getLauncherFromName(launcherName)
  }
}
