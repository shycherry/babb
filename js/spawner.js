function spawn(command, args, options){
	var spawn = require('child_process').spawn;
  if(!command){
    command = 'calc';
  }
	
  var cmdProcess = spawn(command, args, options);
  var killidProcess = spawn(
    global.BABB.TestConfig.killidPath, 
    [cmdProcess.pid]
  );
	
  cmdProcess.on('exit', function(code){
		console.log('cmdProcess exited with code '+code);    
    if(!killidProcess.killed){
      killidProcess.kill();
    }
	});	
  
}


exports.spawn = spawn;