//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _

global.BABB = require('../config.cfg').config
global.BABB.EventEmitter = new Backbone.View()

var basePlatformViewPath = process.cwd()+'/views/platforms/'
var basePlatformSelectionViewPath = process.cwd()+'/views/platformSelection/'

global.BABB.coreRequire = function(iModuleName){
  return require(process.cwd()+'/core/'+iModuleName)
}

global.BABB.viewsRequire = function(iModuleName){
  return require(process.cwd()+'/views/'+iModuleName)
}

global.BABB.messagesViewsRequire = function(iModuleName){
  return require(process.cwd()+'/views/messages/'+iModuleName+'/messagesView.js')
}

global.BABB.platformsViewsRequire = function(iModuleName){
  return require(basePlatformViewPath+iModuleName+'/platformView.js')
}

global.BABB.platformViewLayoutPath = function(iPlaformViewName){
  return basePlatformViewPath+iPlaformViewName
}

global.BABB.platformSelectionViewLayoutPath = function(iPlatformSelectionViewName){
  return basePlatformSelectionViewPath+iPlatformSelectionViewName
}

global.BABB.platformSelectionViewsRequire = function(iModuleName){
  return require(basePlatformSelectionViewPath+iModuleName+'/PlatformSelectionView.js')
}

//convert all characters to keycode
for(control in global.BABB.Controls){
  var keys = global.BABB.Controls[control]
  for(key in keys){
    if ( _.isString(keys[key]) ){
      keys[key] = keys[key].toUpperCase().charCodeAt(0)
    }
  }
}

global.BABB.Utils = { 
  Spawner : global.BABB.coreRequire('spawner'),
  FilenamesFilter : global.BABB.coreRequire('filenamesFilter').FilenamesFilter,
  Finder : global.BABB.coreRequire('finder'),
  CoreServices : global.BABB.coreRequire('coreServices'),
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