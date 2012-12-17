global.$ = $;

//var backbone = require('backbone');
var path = require('path');
var shell = require('nw.gui').Shell;
var fs = require('fs');
var sniffer = require('./files_sniffer');
var content = null;
var pathToSniff = null;

$(document).ready(function() {
    content = $('#content');
    pathToSniff = $('#pathToSniff');
});

function doSpawn(){
	var spawn = require('child_process').spawn;
	var cmdProcess = spawn('calc');
	
  cmdProcess.on('exit', function(code){
		console.log('cmdProcess exited with code '+code);
	});	

}

function doSniff(){
  clearContent();
  sniffer.stopSniff();
  sniffer.sniff([pathToSniff.val()], function(itemChange){
    console.log('change ! ('+itemChange+")");
  });
  fs.readdir(pathToSniff.val(),function(err, files){
    for(var i in files){
      content.append("<div class='file'>"+files[i]+"</div>");
    }    
  });
}

function clearContent(){
  content.contents().remove();
}