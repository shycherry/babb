var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    if(iRom){
      script = require(iRom.get('path'))
      if(script) {
        script.run()
      }
    }
  }
})
