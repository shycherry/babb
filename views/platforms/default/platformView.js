var BABB = global.BABB


exports.PlatformView = Backbone.View.extend({
  initialize : function(){
    var self = this
    BABB.EventEmitter.on('requestControledViewChange',function(iView){
      if(iView != self){
        self.doUnbindings()
      }else{
        self.doBindings()
        BABB.EventEmitter.trigger('controledViewChanged', self)
      }
    }) //not this    
  },
  
  doUnbindings : function(){
    BABB.EventEmitter.off(null, null, this)
  },

  doBindings : function(){
    this.doUnbindings()
    
    BABB.EventEmitter.on('control-next',function(){
      BABB.EventEmitter.trigger('info', 'next !')
    }, this)
  },
  
})