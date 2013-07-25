var BABB = global.BABB
var Fs = require('fs')

exports.ViewExtends = BABB.PlatformsConfig.defaultViewName

var BasePlatformView = BABB.platformsViewsRequire(exports.ViewExtends).PlatformView

exports.PlatformView = BasePlatformView.extend({

  getPlatform : function(iRom){
    if(iRom && iRom.get('platform')){
      return iRom.get('platform')
    }else{
      return BasePlatformView.prototype.getPlatform.call(this, iRom)
    }
  }

})
