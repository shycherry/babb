var BABBPlatform = global.BABB.coreRequire('platforms').Platform
exports.Platform = BABBPlatform.extend({
  
  isAvailable : function(){
    return true
  },
  
  runRom : function (iPlatform, iRom){    
  },
  
  getRomsPaths : function(){    
    var Platforms = BABB.coreRequire('platforms')
    return Platforms.getAllPlatformsRomsPathes('playableOnes')
  },
  
})
