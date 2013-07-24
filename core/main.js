//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _
var Path = require('path')

global.BABB = require('..'+Path.sep+'config.cfg').config
global.BABB.EventEmitter = new Backbone.View()

var basePlatformViewPath = process.cwd()+Path.sep+'views'+Path.sep+'platforms'+Path.sep
var basePlatformSelectionViewPath = process.cwd()+Path.sep+'views'+Path.sep+'platformSelection'+Path.sep

global.BABB.coreRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'core'+Path.sep+iModuleName)
}

global.BABB.viewsRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'views'+Path.sep+iModuleName)
}

global.BABB.messagesViewsRequire = function(iModuleName){
  return require(process.cwd()+Path.sep+'views'+Path.sep+'messages'+Path.sep+iModuleName+Path.sep+'view.js')
}

global.BABB.platformsViewsRequire = function(iModuleName){
  return require(basePlatformViewPath+iModuleName+Path.sep+'view.js')
}

global.BABB.platformViewLayoutPath = function(iPlaformViewName){
  return basePlatformViewPath+iPlaformViewName
}

global.BABB.platformSelectionViewLayoutPath = function(iPlatformSelectionViewName){
  return basePlatformSelectionViewPath+iPlatformSelectionViewName
}

global.BABB.platformSelectionViewsRequire = function(iModuleName){
  return require(basePlatformSelectionViewPath+iModuleName+Path.sep+'view.js')
}

global.BABB.Utils = {
  Spawner : global.BABB.coreRequire('spawner'),
  FilenamesFilter : global.BABB.coreRequire('filenamesFilter').FilenamesFilter,
  Finder : global.BABB.coreRequire('finder'),
  CoreServices : global.BABB.coreRequire('coreServices')
}

//convert all characters to keycode
for(var control in global.BABB.Controls){
  var keys = global.BABB.Controls[control]
  for(var key in keys){
    if ( _.isString(keys[key]) ){
      keys[key] = keys[key].toUpperCase().charCodeAt(0)
    }
  }
}

var Controller = global.BABB.coreRequire('controller')
var Gui = require('nw.gui')
var BABB = global.BABB


function go(){
  var gui = require('nw.gui')
  gui.Window.get().show()
  new Controller.FrontendView({el : 'body'})
}

$(document).ready(go)
