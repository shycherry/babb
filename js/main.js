global.$ = $;
global.Backbone = Backbone;
global._ = _;

//native libs
var path = require('path');
var shell = require('nw.gui').Shell;
var fs = require('fs');
//my libs
var sniffer = require('./js/files_sniffer');
var model = require('./js/model');

//
var content = null;
var pathToSniff = null;

$(document).ready(retrieveHtmlElements);

function retrieveHtmlElements(){
  content = $('#roms-container');
  pathToSniff = $('#pathToSniff');
}

function doSpawn(){
	var spawn = require('child_process').spawn;
	var cmdProcess = spawn('calc');
	
  cmdProcess.on('exit', function(code){
		console.log('cmdProcess exited with code '+code);
	});	

}

function doSniff(){
  //clearContent();
  //fillContent();
  sniffer.stopSniff();
  sniffer.sniff([pathToSniff.val()], function(itemChange){
    console.log('change ! ('+itemChange+")");
    //clearContent();
    //fillContent();
  });

}

function fillContent(){
  fs.readdir(pathToSniff.val(),function(err, files){
    for(var i in files){
      content.append("<div class='rom'>"+files[i]+"</div>");
    }    
  });    
}

function clearContent(){
  content.contents().remove();
}