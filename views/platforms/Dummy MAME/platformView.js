var BABB = global.BABB


exports.PlatformView = Backbone.View.extend({
  initialize : function(){
    this.doBindings()
  },
  
  doUnbindings : function(){
    BABB.EventEmitter.off(null, null, this)
  },

  doBindings : function(){
    this.doUnbindings()
    
    BABB.EventEmitter.on('requestControledViewChange',function(iView){
      if(iView != this){
        this.doUnbindings()
      }else{
        this.doBindings()
        BABB.EventEmitter.trigger('controledViewChanged', this)
      }
    }, this)
    
    BABB.EventEmitter.on('control-next',function(){
      BABB.EventEmitter.trigger('info', 'next !')
    }, this)
  },
  
})