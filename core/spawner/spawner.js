var _ = global._
var Fs = require('fs')
var ChildProcess = require('child_process')
var spawnerExitTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_exit_template.html').toString())
var spawnerStartTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_start_template.html').toString())
var spawnerErrorTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_error_template.html').toString())

function spawnChildProcess(command, args, options, childProcessFunction, iPlatform, iRom){	  
  if(!command){
    global.BABB.EventEmitter.trigger('error', spawnerErrorTemplate({error : 'no command specified'}))
    return
  }
	
  var cmdProcess = childProcessFunction(command, args, options)
  var killidProcess = ChildProcess.spawn(
    global.BABB.GlobalConfig.killidPath, 
    [cmdProcess.pid, iPlatform.get('name'), iRom.get('title')]
  )
  console.log(command+' started')
  global.BABB.EventEmitter.trigger('status', spawnerStartTemplate({command: command, args : args, options : options, cmdPid: cmdProcess.pid, playitPid : killidProcess.pid}))
  
  cmdProcess.on('exit', function(code){
		console.log(command+' exited with code '+code)
    global.BABB.EventEmitter.trigger('info', spawnerExitTemplate({command: command, code: code}))
    if(!killidProcess.killed){
      killidProcess.kill()
    }
	})
  
}

function spawn(command, args, options, iPlatform, iRom){  
  spawnChildProcess(
    command, 
    args, 
    options, 
    function(command, args, options){      
      return ChildProcess.spawn(command, args, options)
    }, 
    iPlatform, 
    iRom
  )
}

function exec(command, options, iPlatform, iRom){  
  spawnChildProcess(
    command, 
    null, 
    options,   
    function(command, args, options){      
      return ChildProcess.exec(command, options)
    },
    iPlatform,
    iRom
  )
}

exports.spawn = spawn
exports.exec = exec