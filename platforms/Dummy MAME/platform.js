var config = require('./config').config
var emulatorPath = config.emulatorPath
var romsPaths = config.romsPaths

var BABB = global.BABB

exports.getName = function(){
  return config.displayName
}

module.doUnbindings = function(){
  BABB.EventEmitter.off(null, null, this)
}

module.doBindings = function(){
  module.doUnbindings()
  
  BABB.EventEmitter.on('requestControledViewChange',function(iView){  
    if(iView != module.platform){
      module.doUnbindings()      
    }else{
      module.doBindings()
      BABB.EventEmitter.trigger('controledViewChanged', module.platform)
    }
  }, this)
  
  BABB.EventEmitter.on('control-next',function(){
    BABB.EventEmitter.trigger('info', 'next !')
  }, this)
}

exports.onSelected = function(iPlatform){
  module.platform = iPlatform
  module.doBindings()
}

exports.getLogoPath = function(){
  return __dirname+'/images/logo.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  return true
}

exports.romsProvider = function(iReport, ioRomsCollection){
  var Roms = global.BABB.Libs.Roms  
  var FilenamesFilter = global.BABB.Libs.FilenamesFilter
  
  var filteredFilesMap = new FilenamesFilter(iReport)
      .keepFilesWithExtensions(config.romsExtensions)
      .onlyKeepBasename()
      .removeExtensions()
      .get()

  for(var locPath in filteredFilesMap){
    var rom = new Roms.Rom({
      title : filteredFilesMap[locPath],
      path : locPath
    })    
    ioRomsCollection.add(rom)
  }  
}

exports.focusRom = function(iRom){
  var Fs = require('fs')
  var metadataPath = iRom.get('path')+'.metadata' 
  if (Fs.existsSync(metadataPath)){
    var img = $('#picts-container img')
    var parent = img.parent()
    img.detach()
    img.attr('src', metadataPath+'/illustration.jpg')    
    parent.append(img)
  }
}

exports.runRom = function (iRom){  
  if(iRom){  
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){
      var Spawner = global.BABB.Libs.Spawner
      var Path = require('path')
      Spawner.spawn(
        emulatorPath, 
        [selectedRomPath], 
        {cwd : Path.dirname(emulatorPath)}
      )      
    }
  }  
}
