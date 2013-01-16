//global definitions
global.$ = $
global.Backbone = Backbone
global._ = _

global.BABB = require('./config').config

global.BABB.Libs = {
  Roms : require('roms'),
  Spawner : require('spawner'),
  FilenamesFilter : require('filenamesFilter').FilenamesFilter,
  Finder : require('finder')
}  

global.BABB.EventEmitter = new Backbone.View()

var Controller = require('controller')
var Gui = require('nw.gui')

function go(){  
  Controller.start()  
  //Gui.Window.get().show()
  
  // try{
    // var find = global.BABB.Libs.Finder.find
    // find('c:/', 'ePSXe.exe', function(fullpath){
      // global.BABB.EventEmitter.trigger('info', 'ePSXe.exe found :'+fullpath)
    // })
  // }catch(err){
    // global.BABB.EventEmitter.trigger('error', err.toString())    
  // }
}

$(document).ready(go)