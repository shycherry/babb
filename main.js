﻿//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _

global.BABB = require('./config').config

//convert all characters to keycode
for(control in global.BABB.Controls){
  var keys = global.BABB.Controls[control]
  for(key in keys){
    if ( _.isString(keys[key]) ){
      keys[key] = keys[key].toUpperCase().charCodeAt(0)
    }
  }
}

global.BABB.Libs = {
  Roms : require('roms'),
  Spawner : require('spawner'),
  FilenamesFilter : require('filenamesFilter').FilenamesFilter,
  Finder : require('finder')
}  

global.BABB.EventEmitter = new Backbone.View()

var Controller = require('controller')
var Gui = require('nw.gui')
var BABB = global.BABB


function go(){
  new Controller.FrontendView({el : 'body'})
}

$(document).ready(go)