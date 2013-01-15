//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _

global.BABB = require('./config').config

global.BABB.Libs = {
  Roms : require('roms'),
  Spawner : require('spawner'),
  FilenamesFilter : require('filenamesFilter').FilenamesFilter
}  

global.BABB.EventEmitter = new Backbone.View()

var Controller = require('controller')
var Gui = require('nw.gui')

function go(){  
  Controller.doSniff()
  //Gui.Window.get().show()
}

$(document).ready(go)