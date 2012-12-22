//define globals
global.$ = $;
global.Backbone = Backbone;
global._ = _;

//native libs
var path = require('path');
var shell = require('nw.gui').Shell;
var fs = require('fs');
//my libs
var Sniffer = require('./js/directory_sniffer');
var spawner = require('./js/spawner');

//
var content = null;
var pathToSniff = null;

$(document).ready(retrieveHtmlElements);

function retrieveHtmlElements(){
  content = $('#roms-container');
  pathToSniff = $('#pathToSniff');
}

function doSniff(){
  Sniffer.stopSniff();
  Sniffer.sniff([pathToSniff.val()]);
}