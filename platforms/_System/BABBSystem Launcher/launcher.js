var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    if(iRom){
      if(iRom.get('title') == 'Retourner A Windows'){
        process.exit()
      }
    }
  }
})
