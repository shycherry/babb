var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    var romPlatform = iRom.get('platform')
    if(iRom && romPlatform){
      romPlatform.runRom(romPlatform, iRom)
    }
  }
})
