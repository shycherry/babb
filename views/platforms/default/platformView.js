var BABB = global.BABB
var Fs = require('fs')

exports.PlatformView = Backbone.View.extend({
  lastSelectedPlatformId : 0,
  
  initialize : function(){
    var self = this
    BABB.EventEmitter.on('requestControledViewChange',function(iView){
      if(iView != self){
        self.doUnbindings()
      }else{
        self.doBindings()
        BABB.EventEmitter.trigger('controledViewChanged', self)
        self.recreateCoverflow()
      }
    }) //not this    
  },
  
  doUnbindings : function(){
    BABB.EventEmitter.off(null, null, this)
  },

  doBindings : function(){
    this.doUnbindings()
    var self = this
    
    BABB.EventEmitter.on('romsCollectionChanged', function(iRomsCollection){
      self.recreateCoverflow(iRomsCollection)
    }, this)
    
    BABB.EventEmitter.on('control-valid', function(){      
      BABB.EventEmitter.trigger('romValidated', self.focusedRom)
    }, this)
    
    BABB.EventEmitter.on('control-next',function(){
      self.coverflowView.Next()
    }, this)
    
    BABB.EventEmitter.on('control-previous', function(){
      self.coverflowView.Previous()
    }, this)
    
    
    BABB.EventEmitter.on('romFocused', function(iRom){
      self.focusedRom = iRom
      self.updateTitle()
    }, this)
    
  },
  
  updateTitle : function(){    
    if(this.focusedRom){
      $('#romTitle').html(this.focusedRom.get('title'))
    }
  },
  
  recreateCoverflow : function(iRomsCollection){
    if(iRomsCollection){
      this.romsCollection = iRomsCollection
    }
    
    var Coverflow = BABB.coreRequire('coverflow')
    var baseWidth = window.innerWidth/4
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(__dirname+'/item-template.html').toString()),
      height: window.innerHeight,      
      width : window.innerWidth,
      perspective : baseWidth,
      cellWidth : baseWidth,
      cellHeight : baseWidth*1.5,
      coverGap : baseWidth*1.1,
      coverOffset : baseWidth/4,
      zUnselected : -baseWidth/2,
      circularSelection : true,
      rotateAngleLeft : 0,
      rotateAngleRight : 0,
      virtualSize:10,
      collection : this.romsCollection,
    })

    this.coverflowView = new Coverflow.CoverflowView({
      el:'#romscoverflow',
      model : coverflowModel
    })    
    
    var self = this
    this.coverflowView.on('focus', function(iRom){
      BABB.EventEmitter.trigger('romFocused', iRom)      
    })
    
    this.coverflowView.on('clicked', function(iRom){
      BABB.EventEmitter.trigger('romValidated', iRom)
    })
    
    this.dynabodyPlatform = null
    this.coverflowView.select(this.lastSelectedPlatformId)    
  },
})
