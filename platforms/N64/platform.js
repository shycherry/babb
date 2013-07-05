var BABBPlatform = global.BABB.coreRequire('platforms').Platform

exports.Platform = BABBPlatform.extend({
  runRom : function (iPlatform, iRom){
    if(iRom){
      var emulatorPath = this.getPlatformConfig().emulatorPath
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')
        var selectedRomPathArgs = selectedRomPath.trim().split(' ')
        Spawner.spawn(
          emulatorPath,
          selectedRomPathArgs,
          {cwd : Path.dirname(emulatorPath)},
          iPlatform,
          iRom
        )
      }
    }
  }
})
