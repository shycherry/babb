var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

exports.KeysView = Backbone.View.extend({
  
  initialize : function(){    
    this.initBindings()
  },
  
  initBindings : function(){
  
    global.window.document.onkeydown = function (keyEvent){
      if( -1 != BABB.Controls.next.indexOf(keyEvent.keyCode)){
        BABB.EventEmitter.trigger('control-next')        
      }
      if( -1 != BABB.Controls.previous.indexOf(keyEvent.keyCode)){
        BABB.EventEmitter.trigger('control-previous')        
      }
      if( -1 != BABB.Controls.valid.indexOf(keyEvent.keyCode)){
        BABB.EventEmitter.trigger('control-valid')        
      }
      if( -1 != BABB.Controls.back.indexOf(keyEvent.keyCode)){
        BABB.EventEmitter.trigger('control-back')        
      }
    }
  },
  
})


