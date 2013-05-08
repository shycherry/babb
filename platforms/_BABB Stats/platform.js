var BABBPlatform = global.BABB.coreRequire('platforms').Platform

exports.Platform = BABBPlatform.extend({
  
  isAvailable : function(){
    return true
  },
  
  runRom : function (iPlatform, iRom){    
  },
  
})
