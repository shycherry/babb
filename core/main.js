﻿//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _

global.BABB = require('../config.cfg').config

global.BABB.coreRequire = function(iModuleName){
  return require(process.cwd()+'/core/'+iModuleName)
}

global.BABB.viewsRequire = function(iModuleName){
  return require(process.cwd()+'/views/'+iModuleName)
}

global.BABB.platformSelectionViewsRequire = function(iModuleName){
  return require(process.cwd()+'/views/platformSelectionViews/'+iModuleName)
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
  Roms : global.BABB.coreRequire('roms'),
  Spawner : global.BABB.coreRequire('spawner'),
  FilenamesFilter : global.BABB.coreRequire('filenamesFilter').FilenamesFilter,
  Finder : global.BABB.coreRequire('finder'),
  CoreServices : global.BABB.coreRequire('coreServices'),
}  

global.BABB.EventEmitter = new Backbone.View()

var Controller = global.BABB.coreRequire('controller')
var Gui = require('nw.gui')
var BABB = global.BABB


function go(){
  new Controller.FrontendView({el : 'body'})
}

$(document).ready(go)