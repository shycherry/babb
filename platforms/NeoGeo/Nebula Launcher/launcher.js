var BABBLauncher = BABB.coreRequire('launchers').Launcher;
var Spawner = BABB.Utils.Spawner;
var Path = require('path');
var Fs = require('fs');

exports.Launcher = BABBLauncher.extend({
  runRom : function (iPlatform, iRom){
    if(iRom){
      var emulatorPath = this.getLauncherConfig().emulatorPath;
      var emulatorRootPath = Path.dirname(emulatorPath);
      var selectedRomPath = iRom.get('path');
      var selectedRomBaseName = Path.basename(selectedRomPath);

      if(selectedRomPath){

        //copy rom in the nebula roms directory (default config for nebula)
        var copiedInNebulaRomPath = Path.join(emulatorRootPath, 'roms', selectedRomBaseName);
        BABB.Utils.CoreServices.copyFile(selectedRomPath, copiedInNebulaRomPath, function(err){
        
          //remove copied rom file at the end
          BABB.EventEmitter.on('afterRun', function(iFinishedRom, iFinishedPlatform){
            if((iFinishedPlatform != iPlatform) || (iFinishedRom != iRom))
              return;
            if(Fs.existsSync(copiedInNebulaRomPath)){
              Fs.unlinkSync(copiedInNebulaRomPath);
            }
          });

          //go          
          Spawner.spawn(
            emulatorPath,
            [iRom.get('title')],
            {cwd : emulatorRootPath},
            iPlatform,
            iRom
          );
        
        });
        
      }
    }
  }
});
