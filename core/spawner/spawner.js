var _ = global._
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var BABB = global.BABB
var spawnerExitTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_exit_template.html').toString())
var spawnerStartTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_start_template.html').toString())
var spawnerErrorTemplate = _.template(Fs.readFileSync(__dirname+'/spawner_error_template.html').toString())

function invokeChildProcess(command, args, options, childProcessFunction, iPlatform, iRom){

  if(!command){
    BABB.EventEmitter.trigger('error', spawnerErrorTemplate({error : 'no command specified'}))
    return
  }

  var cmdProcess = childProcessFunction(command, args, options)

  BABB.EventEmitter.trigger('prepareRun', iRom, iPlatform)

  var platformName = (iPlatform ? iPlatform.get('name') : 'noname')
  var romTitle = (iRom ? iRom.get('title') : 'notitle')
  var killidProcess = ChildProcess.spawn(
    Path.basename(BABB.GlobalConfig.killidPath),
    [cmdProcess.pid, BABB.GlobalConfig.killidKey, platformName, romTitle],
    {cwd:Path.dirname(BABB.GlobalConfig.killidPath)}
  )
  BABB.log(command+' started')
  BABB.EventEmitter.trigger('status', spawnerStartTemplate({command: command, args : args, options : options, cmdPid: cmdProcess.pid, playitPid : killidProcess.pid}))
  
  cmdProcess.on('exit', function(code){
    BABB.log(command+' exited with code '+code)
    BABB.EventEmitter.trigger('afterRun', iRom, iPlatform)
    BABB.EventEmitter.trigger('info', spawnerExitTemplate({command: command, code: code}))
    if(!killidProcess.killed){
      killidProcess.kill()
    }
  })
  
}

function spawn(command, args, options, iPlatform, iRom){
  invokeChildProcess(
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
  invokeChildProcess(
    command,
    null,
    options,
    function(command, options){
      return ChildProcess.exec(command, options)
    },
    iPlatform,
    iRom
  )
}

function execFile(command, args, options, iPlatform, iRom){
  invokeChildProcess(
    command,
    args,
    options,
    function(command, args, options){
      return ChildProcess.execFile(command, args, options, function(err, stdout, stderr){
        BABB.log('err:'+err+' stdout:'+stdout+' stderr:'+stderr)
      })
    },
    iPlatform,
    iRom
  )
}

exports.spawn = spawn
exports.exec = exec
exports.execFile = execFile
