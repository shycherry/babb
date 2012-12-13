global.$ = $;

var backbone = require('backbone');
var path = require('path');
var shell = require('nw.gui').Shell;

$(document).ready(function() {
  $('.std_button').on('mousemove', function(){
    $('body').append("hey");
  });
});

function doSpawn(){
	var spawn = require('child_process').spawn;
	var cmdProcess = spawn('calc');
	
	cmdProcess.on('exit', function(code){
		console.log('cmdProcess exited with code '+code);
	});
		
}