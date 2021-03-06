﻿var $ = global.$
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
    BABB.log('PlatformsCollectionView initialize')
    var self = this
    BABB.EventEmitter.on('requestControledViewChange', function(iView){
      if(iView != self){
        self.doUnbindings()
        CoreServices.clearPlatformSelectionContainer()
        CoreServices.setVisiblePlatformView(true)
        CoreServices.setVisiblePlatformSelectionView(false)

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
    }, this)

    BABB.EventEmitter.on('platformValidated', function(iPlatform){
      self.lastSelectedPlatformId = self.platformsCollection.indexOf(iPlatform)
    }, this)

    BABB.EventEmitter.on('requestRenderPlatform', function(iPlatform){

        CoreServices.renderPlatformView(iPlatform, null, (function(iPlatform){
          return function(){
            BABB.EventEmitter.trigger('platformRendered',iPlatform)
          }
        })(iPlatform))

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
    var baseWidth = window.innerWidth/3
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(__dirname+'/platform-template.html').toString()),
      height: window.innerHeight,
      width : window.innerWidth,
      left : window.innerWidth/2,
      top : window.innerHeight/2,
      perspective : baseWidth,
      cellWidth : baseWidth,
      cellHeight : baseWidth,
      coverGap : baseWidth/3,
      coverOffset : baseWidth,
      zUnselected : -baseWidth,
      circularSelection : false,
      virtualSize:4,
      collection : this.platformsCollection
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

    this.coverflowView.select(this.lastSelectedPlatformId)
  },

  updateTitle : function(){
    if(this.focusedPlatform){
      $('#platformTitle').html(this.focusedPlatform.get('name'))
    }
  },

  toString : function(){
    return 'PlatformsCollectionView'
  }

})

exports.PlatformSelectionView = PlatformSelectionView
