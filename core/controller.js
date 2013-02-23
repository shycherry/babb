var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')
var Path = require('path')
var Sniffer = BABB.coreRequire('sniffer')
var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView
var BandanaView = BABB.coreRequire('bandana').BandanaView
var RomsCollectionView = BABB.coreRequire('roms').RomsCollectionView
var KeysView = BABB.coreRequire('keysController').KeysView

var Platform = BABB.coreRequire('platforms').Platform
var PlatformsCollection = BABB.coreRequire('platforms').PlatformsCollection


exports.FrontendView = Backbone.View.extend({
  
  platformsCollection : new PlatformsCollection(),
  
  initialize : function(){        
    this.keysView = new KeysView()
    this.bandanaView = new BandanaView()
    this.retrievePlatformSelectionView()
    //this.romsCollectionView = new RomsCollectionView( {el : $(BABB.RomsConfig.romsContainerId)} )
    this.changeCurrentView(this.platformSelectionView)
    this.currentValidatedPlatform = null
    this.initBindings()
    this.sniffPlatforms()
  },
    
  sniffPlatforms : function(){
    this.platformsCollection.reset()
    var pathsToSniff = [BABB.PlatformsConfig.defaultPlatformsPath]
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
      // if(!this.getSelected()){
        // this.selectNext()
      // }      
    }    
  },
  
  onPlatformsChanged : function(){
    BABB.EventEmitter.trigger('platformsCollectionChanged', this.platformsCollection)    
  },
  
  retrievePlatformSelectionView : function(){
    var viewName = BABB.PlatformSelectionConfig.viewName+'/platformView.js'
    var PlatformSelectionView = BABB.platformSelectionViewsRequire(viewName).PlatformSelectionView
    this.platformSelectionView = new PlatformSelectionView()
  },
      
  initBindings : function(){
    _.bindAll(this, 'onPlatformsSniffed')
    _.bindAll(this, 'onPlatformsChanged')
    _.bindAll(this, 'changeCurrentView')    
    
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
        return
      }

      self.currentValidatedPlatform = iPlatform
      
      iPlatform.onSelectedDelegate()
      
      //
      $('#coverflow').css('opacity', '0')
      var dynabody = $('#dynabody')
      dynabody.detach()
      $('body').append(dynabody)
      dynabody.addClass('docked')
      //
      self.changeCurrentView(self.romsCollectionView) 
    })    
    
    BABB.EventEmitter.on('control-valid', function(){      
      //
    })
    
    BABB.EventEmitter.on('control-back', function(){
      //
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
        self.changeCurrentView(self.romsCollectionView)
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
          self.changeCurrentView(self.romsCollectionView)
        }
      }else{
        self.romsCollectionView.selectNext()
      }
    })
    
    this.romsCollectionView.on('back', function(){
      self.changeCurrentView(self.platformSelectionView)
    })
    
  },
  
  changeCurrentView : function(iNewCurrentView){        
    if(iNewCurrentView && iNewCurrentView != this.currentView){      
      this.currentView = iNewCurrentView
      if(this.currentView == this.platformSelectionView){
        $('#dynabody').removeClass('parallax')
        $(BABB.RomsConfig.romsContainerId).addClass('hidden')
        $(BABB.PlatformsConfig.platformsContainerId).removeClass('hidden')
      }
      else if(this.currentView == this.romsCollectionView){
        $('#dynabody').addClass('parallax')
        $(BABB.PlatformsConfig.platformsContainerId).addClass('hidden')
        $(BABB.RomsConfig.romsContainerId).removeClass('hidden')
      }
    }
    
    // if(iNewCurrentView){
      // iNewCurrentView.setSelected(iNewCurrentView.getSelected())
    // }
  }
})
