function spawn(command){
	var spawn = require('child_process').spawn;
  if(!command){
    command = 'calc';
  }
	
  var cmdProcess = spawn(command);
	
  cmdProcess.on('exit', function(code){
		console.log('cmdProcess exited with code '+code);
	});	
}


exports.spawn = spawn;