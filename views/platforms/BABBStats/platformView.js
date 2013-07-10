var BABB = global.BABB
var Fs = require('fs')
var KeysController = BABB.coreRequire('keysController')
var BasePlatformView = BABB.platformsViewsRequire('default').PlatformView

exports.PlatformView = BasePlatformView.extend({

  getCoverflowTemplatePath : function(){
    return __dirname+'/item-template.html'
  },

  getPlatform : function(iRom){
    if(iRom && iRom.get('platform')){
      return iRom.get('platform')
    }else{
      return BasePlatformView.prototype.getPlatform.call(this, iRom)
    }
  }

})
