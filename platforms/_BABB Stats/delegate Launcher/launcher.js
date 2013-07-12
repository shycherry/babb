var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    var romPlatform = iRom.get('platform')
    if(romPlatform && iRom){
      var platformLauncher = romPlatform.getLauncher(iRom)
      if(platformLauncher){
        platformLauncher.runRom(romPlatform, iRom)
      }
    }
  }
})
