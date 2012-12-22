//define globals
global.$ = $;
global.Backbone = Backbone;
global._ = _;

//native libs
var Gui = require('nw.gui');
//my libs
var Sniffer = require('./js/directory_sniffer');
var spawner = require('./js/spawner');

//
var content = null;
var pathToSniff = null;

$(document).ready(finishLoading);

function finishLoading(){
  content = $('#roms-container');
  pathToSniff = $('#pathToSniff');
  
  //Gui.Window.get().show();
}

function doSniff(){
  Sniffer.stopSniff();
  Sniffer.sniff([pathToSniff.val()]);
}