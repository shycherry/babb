var BABBPlatform = global.BABB.coreRequire('platforms').Platform

exports.Platform = BABBPlatform.extend({
  
  isAvailable : function(){
    return true
  },
  
  runRom : function (iPlatform, iRom){
    if(iRom){
      if(iRom.get('title') == 'Retourner A Windows'){
        process.exit()
      }else{    
        var selectedRomPath = iRom.get('path')
        if(selectedRomPath){
          var Spawner = global.BABB.Utils.Spawner      
          Spawner.exec(
            selectedRomPath,
            null,
            null,
            iPlatform,
            iRom
          )
        }
      }
    }    
  },
})



