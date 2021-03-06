﻿var BABBLauncher = global.BABB.coreRequire('launchers').Launcher
var Fs = require('fs')
var Path = require('path')

exports.Launcher = BABBLauncher.extend({

  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    if(iRom){
      if(iRom.get('title') == 'Retourner A Windows'){
        process.exit()
      }else{
        var selectedLNKRomPath = iRom.get('path')
        if(selectedLNKRomPath){
          var absolutePathToExe = /.:\\[\w\\ \/\(\)\[\]^§';µ~ç*{}`âàäéèëêîïìôöòüûù°+=@%£$,!.-]+?\.(exe|bat|com)/.exec(Fs.readFileSync(selectedLNKRomPath).toString())[0]

          var Spawner = global.BABB.Utils.Spawner
          Spawner.spawn(
            absolutePathToExe,
            [],
            {cwd : Path.dirname(absolutePathToExe)},
            iPlatform,
            iRom
          )
        }
      }
    }
  }
})
