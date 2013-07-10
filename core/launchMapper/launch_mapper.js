var Config = global.BABB.LaunchMapperConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var EventEmitter = global.BABB.EventEmitter


var buildLaunchMapperPath = function(iRom, iPlatform){
  var launchMapperPath = Config.savePath
  if(iRom && iPlatform){
    launchMapperPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
  }
  return launchMapperPath
}

var writeFile = function(iPath, data){
  if( ! Fs.existsSync(Config.savePath)){
    Fs.mkdirSync(Config.savePath)
  }
  if( ! Fs.existsSync(iPath)){
    Fs.writeFileSync(iPath, data)
  }

}

exports.mapLauncher = function(iRom, iPlatform, iLauncher){
  if(!iPlatform){
    return
  }
  var savePath = buildLaunchMapperPath(iRom, iPlatform)
  writeFile(savePath, iLauncher.get('name'))
}

exports.getLauncher = function(iRom, iPlatform){
  if(!iRom || !iPlatform){
    return
  }
  var savePath = buildLaunchMapperPath(iRom, iPlatform)
  if(Fs.existsSync(savePath)){
    var launcherName = Fs.readFileSync(savePath).toString()
    return iPlatform.getRunnerFromName(launcherName)
  }
}
