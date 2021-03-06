var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

exports.MessagesView = Backbone.View.extend({

  el : $(BABB.BandanaConfig.bandanaId),
  lastFocusTimeoutId : 0,

  initialize : function(){
    _.bindAll(this, 'render')
    _.bindAll(this, 'onError')
    _.bindAll(this, 'onInfo')
    _.bindAll(this, 'onMouseMove')
    this.listenTo(BABB.EventEmitter, 'info', this.onInfo)
    this.listenTo(BABB.EventEmitter, 'status', this.onStatus)
    this.listenTo(BABB.EventEmitter, 'error', this.onError)
    this.$el.bind("mousemove", this.onMouseMove)
    
    var self = this
    this.$el.on("mousewheel", function(event, delta){
      if(self.$el.hasClass('focus')){
        event.stopPropagation()
      }
    })    
  },

  onStatus : function(msg){
    this.$el.removeClass('info')  
    this.$el.removeClass('error')  
    this.$el.addClass('status')
    this.render(msg);
  },
  
  onError : function(msg){   
    this.$el.removeClass('info')  
    this.$el.removeClass('status')  
    this.$el.addClass('error')
    this.render(msg);
  },

  onInfo : function(msg){   
    this.$el.removeClass('error')  
    this.$el.removeClass('status')  
    this.$el.addClass('info')
    this.render(msg);
  },
  
  onMouseMove : function(){
    if(this.$el.hasClass('focus')){
      this.temporaryFocusBandana()
    }
  },
  
  temporaryFocusBandana : function(){
    clearTimeout(this.lastFocusTimeoutId)
    this.$el.addClass('focus')
    var self = this
    this.lastFocusTimeoutId = setTimeout(function(){
      self.$el.removeClass('focus')
    },3000)
  },
  
  render : function(msg){    
    this.$el.html(msg)
    this.temporaryFocusBandana()
  }

})
