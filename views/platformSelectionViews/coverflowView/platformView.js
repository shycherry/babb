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
var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView


var PlatformSelectionView = Backbone.View.extend({
	platformsCollection : new PlatformsCollection(),		
	  
  initialize : function() {
    console.log('PlatformsCollectionView initialize')    
    this.doBindings()
	},
  
  doBindings :function(){    
    var self = this    
    
    BABB.EventEmitter.on('platformsCollectionChanged', function(iPlatformsCollection){
      self.recreateCoverflow(iPlatformsCollection)
    })
    
    BABB.EventEmitter.on('control-valid', function(){      
      BABB.EventEmitter.trigger('platformValidated', this.focusedPlatform)
    })
    
    BABB.EventEmitter.on('control-next', function(){
      self.coverflowView.Next()    
    })
    
    BABB.EventEmitter.on('control-previous', function(){
      self.coverflowView.Previous()
    })
    
    BABB.EventEmitter.on('platformFocused', function(iPlatform){
      self.focusedPlatform = iPlatform
      
      clearTimeout(self.lastFocusTimeoutId)      
      if(self.focusedPlatform != self.dynabodyPlatform){
        self.lastFocusTimeoutId = setTimeout(function(){
          self.dynabodyPlatform = self.focusedPlatform
          self.previewPlatform(self.dynabodyPlatform)      
        },800)
      }
    })
  },
  
  recreateCoverflow : function(iPlatformsCollection){
    this.platformsCollection = iPlatformsCollection
    
    var Coverflow = BABB.coreRequire('coverflow')
    var baseWidth = window.innerWidth/2
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(__dirname+'/platform-template.html').toString()),
      height: window.innerHeight,      
      width : window.innerWidth,
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
    
    this.coverflowView.select(0)
    global.coverflow = this.coverflowView
  },
   
  previewPlatform : function(iPlatform){    
    if(iPlatform){
      $('.coverflow-cell #dynabody').detach()       
      var focusedCell = $('.coverflow-cell.focus')    
      var dynabody = $(window.document.createElement('div'))
      dynabody.attr('id', 'dynabody')
      if(! iPlatform.isAvailableDelegate()){
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
