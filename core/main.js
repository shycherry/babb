//process protection
process.on('uncaughtException', function(err){
  if(global.BABB.EventEmitter){
    global.BABB.EventEmitter.trigger('error', 'Unexpected error occured... frontend may be in an invalid state. <br/> Message is : '+err.message)
  }
})

//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _
var Path = require('path')

global.BABB = require(Path.resolve('.'+Path.sep+'config.cfg')).config
var BABB = global.BABB

BABB.EventEmitter = new Backbone.View()

var basePlatformViewPath = process.cwd()+Path.sep+'views'+Path.sep+'platforms'+Path.sep
var basePlatformSelectionViewPath = process.cwd()+Path.sep+'views'+Path.sep+'platformSelection'+Path.sep

BABB.log = function(iData){
  if(BABB.GlobalConfig.loggingEnabled){
    console.log(iData)
  }
}

BABB.coreRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'core'+Path.sep+iModuleName)
}

BABB.viewsRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'views'+Path.sep+iModuleName)
}

BABB.messagesViewsRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'views'+Path.sep+'messages'+Path.sep+iModuleName+Path.sep+'view.js')
}

BABB.platformsViewsRequire = function(iModuleName){
  return require(basePlatformViewPath+iModuleName+Path.sep+'view.js')
}

BABB.platformViewLayoutPath = function(iPlaformViewName){
  return basePlatformViewPath+iPlaformViewName
}

BABB.platformSelectionViewLayoutPath = function(iPlatformSelectionViewName){
  return basePlatformSelectionViewPath+iPlatformSelectionViewName
}

BABB.platformSelectionViewsRequire = function(iModuleName){
  return require(basePlatformSelectionViewPath+iModuleName+Path.sep+'view.js')
}

BABB.Utils = {
  Spawner : BABB.coreRequire('spawner'),
  FilenamesFilter : BABB.coreRequire('filenamesFilter').FilenamesFilter,
  Finder : BABB.coreRequire('finder'),
  CoreServices : BABB.coreRequire('coreServices')
}

//convert all characters to keycode
for(var control in BABB.Controls){
  var keys = BABB.Controls[control]
  for(var key in keys){
    if ( _.isString(keys[key]) ){
      keys[key] = keys[key].toUpperCase().charCodeAt(0)
    }
  }
}

var Controller = BABB.coreRequire('controller')

function go(){
  var gui = require('nw.gui')
  gui.Window.get().show()
  new Controller.FrontendView({el : 'body'})
}

$(document).ready(go)
