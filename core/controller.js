var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')
var Path = require('path')
var Sniffer = BABB.coreRequire('sniffer')
var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView
var RomsCollectionView = BABB.coreRequire('roms').RomsCollectionView
var KeysView = BABB.coreRequire('keysController').KeysView

var Platform = BABB.coreRequire('platforms').Platform
var PlatformsCollection = BABB.coreRequire('platforms').PlatformsCollection


exports.FrontendView = Backbone.View.extend({
  
  platformsCollection : new PlatformsCollection(),
  
  initialize : function(){        
    this.keysView = new KeysView()
    $('#platformSelectionContainer').hide()
    $('#platformContainer').hide()
    //$('#bandana').hide()
    
    this.retrieveCfgMessagesView()
    this.retrieveCfgPlatformSelectionView()
    this.currentValidatedPlatform = null
    this.initBindings()
    this.sniffPlatforms()
    BABB.EventEmitter.trigger('requestControledViewChange', this.platformSelectionView)
  },
    
  sniffPlatforms : function(){
    this.platformsCollection.reset()
    var pathsToSniff = [BABB.GlobalConfig.defaultPlatformsPath]
    Sniffer.stopSniff(pathsToSniff)
    Sniffer.sniff(pathsToSniff, this.onPlatformsSniffed)
  },
  
  onPlatformsSniffed : function(iReport){
    if(iReport.isUpdate){
      this.sniffPlatforms()
    }else{
      for(locSniffedPath in iReport){
        var locSniffedFilesArray = iReport[locSniffedPath]

        for(var i in locSniffedFilesArray){
          var locFileName = locSniffedFilesArray[i]
          var pathNormalized = Path.join(locSniffedPath,locFileName)
          pathNormalized = Path.normalize(pathNormalized)
          if(Fs.existsSync(pathNormalized+'/platform.js')){
            var platform = new Platform({path : pathNormalized})            
            this.platformsCollection.add(platform)
          }
        }
      }
    }    
  },
  
  onPlatformsChanged : function(){
    BABB.EventEmitter.trigger('platformsCollectionChanged', this.platformsCollection)    
  },
  
  retrieveCfgMessagesView : function(){    
    var viewName = BABB.MessagesConfig.viewName
    var MessagesView = BABB.messagesViewsRequire(viewName).MessagesView
    this.messagesView = new MessagesView()
  },
  
  retrieveCfgPlatformSelectionView : function(){    
    var viewName = BABB.PlatformSelectionConfig.viewName
    var PlatformSelectionView = BABB.platformSelectionViewsRequire(viewName).PlatformSelectionView
    this.platformSelectionView = new PlatformSelectionView()    
  },
      
  initBindings : function(){
    _.bindAll(this, 'onPlatformsSniffed')
    _.bindAll(this, 'onPlatformsChanged')
    
    this.platformsCollection.on('change', this.onPlatformsChanged)
    this.platformsCollection.on('add', _.throttle(this.onPlatformsChanged,100))
    this.platformsCollection.on('remove', this.onPlatformsChanged)
    this.platformsCollection.on('reset', this.onPlatformsChanged)
    
    
    var self = this
    
    BABB.EventEmitter.on('platformValidated', function(iPlatform){
      console.log('selecion validated :'+iPlatform.get('name'))
      
      if( ! iPlatform){
        return
      }
      
      if( ! iPlatform.isAvailableDelegate()){
        BABB.EventEmitter.trigger('error', iPlatform+' is not available')
      }else{
        self.currentValidatedPlatform = iPlatform
        
        var PlatformView = BABB.platformsViewsRequire(iPlatform.get('viewName')).PlatformView
        PlatformView = new PlatformView()
        PlatformView.associatedPlatform = iPlatform
        BABB.EventEmitter.trigger('requestControledViewChange', PlatformView)
      }
    })    
    
    BABB.EventEmitter.on('control-back', function(){      
      BABB.EventEmitter.trigger('requestControledViewChange', self.platformSelectionView)      
    })
  },
  
  unbindRomsCollection : function(){
    if(this.romsCollectionView){
      this.romsCollectionView.off('back')
      this.romsCollectionView.off('selectionValidated')
      this.romsCollectionView.off('selectionChanged')
      this.romsCollectionView.stopSniff()
    }
  },
  
  bindRomsCollection : function(iPlatform){
    var self = this    
    this.romsCollectionView.doSniff(iPlatform)
    
    this.romsCollectionView.on('selectionChanged', function(){
      if(self.romsCollectionView.getSelected()){
        BABB.EventEmitter.trigger('requestControledViewChange', self.romsCollectionView)        
      }
    })
    
    this.romsCollectionView.on('selectionValidated', function(parRom){
      if(parRom){
        if($(BABB.RomsConfig.romsContainerId).hasClass('focus')){
          var selectedPlatform = self.platformSelectionView.getSelected()
          if(selectedPlatform){
            selectedPlatform.runRomDelegate(parRom)
          }
        }else{
          BABB.EventEmitter.trigger('requestControledViewChange', self.romsCollectionView)
        }
      }else{
        self.romsCollectionView.selectNext()
      }
    })
    
    this.romsCollectionView.on('back', function(){
      BABB.EventEmitter.trigger('requestControledViewChange', self.platformSelectionView)      
    })
    
  },  
})
