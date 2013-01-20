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
  new Controller.FrontendView({el : 'body'})
  //Gui.Window.get().show()
  
  // try{
   // var find = global.BABB.Libs.Finder.find
   // find('c:/NodeWebkit', 'testtofind.db', function(fullpath){
    // global.BABB.EventEmitter.trigger('info', 'mcbase.db found :'+fullpath)
   // },
   // function(){
    // global.BABB.EventEmitter.trigger('info', 'mcbase.db was not found')
   // })
  // }catch(err){
   // global.BABB.EventEmitter.trigger('error', err.toString())    
  // }
}

$(document).ready(go)