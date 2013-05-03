var BABB = global.BABB
var Fs = require('fs')
var History = require('./history.js')
var KeysController = BABB.coreRequire('keysController')

var BasePlatformView = BABB.platformsViewsRequire('default').PlatformView

exports.PlatformView = BasePlatformView.extend({
  
  doBindings : function(){
    BasePlatformView.prototype.doBindings.call(this)
    History.loadHistory()
  },
  
  updateStuff : function(){
    BasePlatformView.prototype.updateStuff.call(this)
    this.updateHistory()
  },
  
  updateHistory : function(){    
    if(this.focusedRom){     
      var historyEntry = History.getHtmlEntry(this.focusedRom.get('title'))
      $('#history-container').html(historyEntry)
    }
  },
  
})
