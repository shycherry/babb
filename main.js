//global definitions
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


function go(){
  new Controller.FrontendView({el : 'body'})
  //Gui.Window.get().show()
  
  var c = require('coverflow');
  var model = new c.CoverflowModel({
    collection : new Backbone.Collection([
        {title:'game1'}, 
        {title:'game2'}, 
        {title:'game3'},
        {title:'game4'},
        {title:'game5'},
        {title:'game6'}
      ]),
      selectedIndex:1,
      height: window.innerHeight,      
      width : window.innerWidth,
      perspective : window.innerWidth/4,
      cellWidth : window.innerWidth/4,
      cellHeight : window.innerWidth/4,
      coverGap : window.innerWidth/16,
      coverOffset : window.innerWidth/4,
      zUnselected : -window.innerWidth/4,
      circularSelection : true,
    })
      
  c = new c.CoverflowView({
      el:'#coverflow',
      model : model
    })
  c.render()
  global.coverflow = c
}

$(document).ready(go)