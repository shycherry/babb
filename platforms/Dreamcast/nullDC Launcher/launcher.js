var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  runRom : function (iPlatform, iRom){
    if(iRom){
      var emulatorPath = this.getPlatformConfig().emulatorPath
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')
        Spawner.spawn(
          emulatorPath,
          [          
          '-config', 'nullDC:Emulator.Autostart=1',
          '-config', 'ImageReader:LoadDefaultImage=1',
          '-config', 'ImageReader:DefaultImage='+selectedRomPath
          ],
          {cwd : Path.dirname(emulatorPath)},
          iPlatform,
          iRom
        )
      }
    }
  }
})
