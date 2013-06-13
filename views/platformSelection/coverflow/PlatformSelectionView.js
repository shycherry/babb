var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')
var Path = require('path')
var Roms = BABB.coreRequire('roms')
var Platform = BABB.coreRequire('platforms').Platform
var CoreServices = BABB.coreRequire('coreServices')
var PlatformsCollection = BABB.coreRequire('platforms').PlatformsCollection


var PlatformSelectionView = Backbone.View.extend({
	platformsCollection : new PlatformsCollection(),		
  lastSelectedPlatformId : 0,
	  
  initialize : function() {
    console.log('PlatformsCollectionView initialize')    
    var self = this    
    BABB.EventEmitter.on('requestControledViewChange', function(iView){
      if(iView != self){        
        self.doUnbindings()
        CoreServices.clearPlatformSelectionContainer()
        CoreServices.renderPlatform(iView.associatedPlatform, null, function(){
          CoreServices.setVisiblePlatformView(true)                  
          CoreServices.setVisiblePlatformSelectionView(false)        
        })
        
      }else{
        self.doBindings()
        CoreServices.clearPlatformContainer()
        CoreServices.renderPlatformSelectionView(null, function(){      
          CoreServices.setVisiblePlatformSelectionView(true)
          CoreServices.setVisiblePlatformView(false)
          self.recreateCoverflow()          
        })
        BABB.EventEmitter.trigger('controledViewChanged', self)
      }
      
    })//not this
    
	},
  
  doBindings :function(){    
    
    this.doUnbindings()
    var self = this    
    BABB.EventEmitter.on('platformsCollectionChanged', function(iPlatformsCollection){
      self.recreateCoverflow(iPlatformsCollection)
    }, this)
    
    BABB.EventEmitter.on('control-valid', function(){      
      BABB.EventEmitter.trigger('platformValidated', self.focusedPlatform)
    }, this)
    
    BABB.EventEmitter.on('control-next', function(){
      self.coverflowView.Next()    
    }, this)
    
    BABB.EventEmitter.on('control-previous', function(){
      self.coverflowView.Previous()
    }, this)
    
    BABB.EventEmitter.on('platformFocused', function(iPlatform){
      self.focusedPlatform = iPlatform
      self.updateTitle()      
      clearTimeout(self.lastFocusTimeoutId)      
      if(self.focusedPlatform != self.dynabodyPlatform){
        self.lastFocusTimeoutId = setTimeout(function(){
          self.dynabodyPlatform = self.focusedPlatform
          self.previewPlatform(self.dynabodyPlatform)      
        },800)
      }
    }, this)
    
    BABB.EventEmitter.on('platformValidated', function(iPlatform){
      
        clearTimeout(self.lastFocusTimeoutId)        
        self.dynabodyPlatform = iPlatform
        self.previewPlatform(iPlatform)
        self.lastSelectedPlatformId = self.platformsCollection.indexOf(iPlatform)
      
    }, this)
    
  },
  
  doUnbindings : function(){
    BABB.EventEmitter.off(null, null, this)
  },
  
  recreateCoverflow : function(iPlatformsCollection){
    if(iPlatformsCollection){
      this.platformsCollection = iPlatformsCollection
    }
    
    var Coverflow = BABB.coreRequire('coverflow')
    var baseWidth = window.innerWidth/2
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(__dirname+'/platform-template.html').toString()),
      height: window.innerHeight,      
      width : window.innerWidth,
      left : window.innerWidth/2,
      top : window.innerHeight/2,
      perspective : baseWidth,
      cellWidth : baseWidth,
      cellHeight : baseWidth,
      coverGap : baseWidth/4,
      coverOffset : baseWidth,
      zUnselected : -baseWidth,
      circularSelection : false,
      virtualSize:10,
      collection : this.platformsCollection,
    })

    this.coverflowView = new Coverflow.CoverflowView({
      el:'#coverflow',
      model : coverflowModel
    })    
    
    var self = this
    this.coverflowView.on('focus', function(iPlatform){
      BABB.EventEmitter.trigger('platformFocused', iPlatform)      
    })
    
    this.coverflowView.on('clicked', function(iPlatform){
      BABB.EventEmitter.trigger('platformValidated', iPlatform)
    })
    
    this.dynabodyPlatform = null
    this.coverflowView.select(this.lastSelectedPlatformId)    
  },
  
  updateTitle : function(){    
    if(this.focusedPlatform){
      $('#platformTitle').html(this.focusedPlatform.get('name'))    
    }
  },
   
  previewPlatform : function(iPlatform){    
    if(iPlatform){      
      $('.coverflow-cell #dynabody').detach()       
      var focusedCell = $('.coverflow-cell.focus')    
      var dynabody = $(window.document.createElement('div'))
      dynabody.attr('id', 'dynabody')
      if(! iPlatform.isAvailable()){
        dynabody.addClass('unavailable')
      }
      CoreServices.renderPlatform(iPlatform, dynabody)
      dynabody.insertBefore(focusedCell.children().first())    
    }
  },
    
  toString : function(){
    return 'PlatformsCollectionView'
  }

})

exports.PlatformSelectionView = PlatformSelectionView
