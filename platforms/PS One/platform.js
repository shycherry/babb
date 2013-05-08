var BABBPlatform = global.BABB.coreRequire('platforms').Platform

exports.Platform = BABBPlatform.extend({
  runRom : function (iPlatform, iRom){  
    if(iRom){  
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')
        Spawner.spawn(
          emulatorPath, 
          ['-nogui','-loadbin', selectedRomPath], 
          {cwd : Path.dirname(emulatorPath)},
          iPlatform,
          iRom
        )      
      }
    }  
  },
})
