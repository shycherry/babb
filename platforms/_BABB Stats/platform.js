
exports.getViewName = function(){
  return 'BABBStats'
}

exports.getName = function(){
  return 'BABB Stats'
}

exports.getLogoPath = function(){
  return __dirname+'/logo.png'
}

exports.isAvailable = function(){
  var Fs = require('fs')
  return true
}

exports.runRom = function (iPlatform, iRom){
  
}


