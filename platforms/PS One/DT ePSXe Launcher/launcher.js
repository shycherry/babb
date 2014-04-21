var Fs = require('fs')
var ChildProcess = require('child_process')
var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  runRom : function (iPlatform, iRom){
    if(iRom){
      var emulatorPath = this.getLauncherConfig().emulatorPath
      var daemonToolsPath = this.getLauncherConfig().daemonToolsPath

      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')

        var daemonToolsMounting = ChildProcess.spawn(
          daemonToolsPath,
          ['-mount', 'scsi,', '0,', selectedRomPath],
          {cwd : Path.dirname(daemonToolsPath)}          
        )
        BABB.EventEmitter.trigger('info', 'mounting with daemon tools...')

        daemonToolsMounting.on('exit', function(code){
          BABB.EventEmitter.trigger('info', 'mounted')
          Spawner.spawn(
            emulatorPath,
            ['-nogui'],
            {cwd : Path.dirname(emulatorPath)},
            iPlatform,
            iRom
          )
        })        
      }
    }
  },

  isAvailable : function(){
    var basicStuffAvailable = BABBLauncher.prototype.isAvailable.call(this)
    var daemonToolsAvailable = Fs.existsSync(this.getLauncherConfig().daemonToolsPath)        
    return (basicStuffAvailable && daemonToolsAvailable); 
  }
  
})
