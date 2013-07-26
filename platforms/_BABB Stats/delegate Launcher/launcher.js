var BABBLauncher = global.BABB.coreRequire('launchers').Launcher

exports.Launcher = BABBLauncher.extend({
  isAvailable : function(){
    return true
  },

  runRom : function (iPlatform, iRom){
    var romPlatform = iRom.get('platform')
    if(romPlatform){
      var platformLauncher = romPlatform.getLauncher(iRom)
      if(platformLauncher && !platformLauncher.isAvailable()){
        BABB.EventEmitter.trigger('error', platformLauncher+' is not available')
      }else if(platformLauncher){
        platformLauncher.runRom(romPlatform, iRom)
      }
    }else{
      BABB.EventEmitter.trigger('error', 'cannot retrieve associated platform')
    }
  }
})
