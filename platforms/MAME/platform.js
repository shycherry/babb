//var history = require('./history')
var $ = global.$

var config = require('./config').config
var emulatorPath = config.emulatorPath
var romsPaths = config.romsPaths

exports.getName = function(){
  return config.displayName
}

exports.getLogoPath = function(){
  return __dirname+'/logo.png'
}

exports.getRomsPaths = function(){
  return romsPaths
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return Fs.existsSync(emulatorPath)
}

exports.romsProvider = function(iReport, ioRomsCollection){
  var Roms = global.BABB.Utils.Roms  
  var FilenamesFilter = global.BABB.Utils.FilenamesFilter
  
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

// a migrer
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
  
  var historyEntry = history.getHtmlEntry(iRom.get('title'))
  $('#info-container').html(historyEntry)
}

exports.onSelected = function(){
  
  $('#info-container').on("mousewheel", function(event){
    event.stopPropagation()
  })    
  
  history.loadHistory()
}
// /a migrer

exports.runRom = function (iRom){
  if(iRom){
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){      
      var Spawner = global.BABB.Utils.Spawner
      var Path = require('path')
      Spawner.spawn(
        emulatorPath, 
        ['-rp', Path.dirname(selectedRomPath), iRom.get('title')],
        {cwd : Path.dirname(emulatorPath)}
      )        
    }
  }  
}