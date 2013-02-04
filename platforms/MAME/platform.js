var mamePath = 'C:/Users/Vincent/Desktop/Emulateur/mame/mame64.exe'
var romsPaths = ["C:/Users/Vincent/Desktop/Roms/MAME"]
var history = require('./history')
var $ = global.$

exports.getName = function(){
  return 'MAME'
}

exports.getLogoPath = function(){
  return __dirname+'/images/8364-haveac00kie-Mame.png'
}

exports.onSelected = function(){
  
  $('#info-container').on("mousewheel", function(event){
    event.stopPropagation()
  })    
  
  history.loadHistory()
}

exports.getRomsPaths = function(){
  return romsPaths
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
  
  var historyEntry = history.getHtmlEntry(iRom.get('title'))
  $('#info-container').html(historyEntry)
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return Fs.existsSync(mamePath)
}

exports.runRom = function (iRom){
  if(iRom){
    var selectedRomPath = iRom.get('path')
    if(selectedRomPath){      
      var Spawner = global.BABB.Libs.Spawner
      var Path = require('path')
      Spawner.spawn(
        mamePath, 
        ['-rp', Path.dirname(selectedRomPath), iRom.get('title')],
        {cwd : Path.dirname(mamePath)}
      )        
    }
  }  
}


