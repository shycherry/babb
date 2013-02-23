var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView
var BandanaView = BABB.coreRequire('bandana').BandanaView
var RomsCollectionView = BABB.coreRequire('roms').RomsCollectionView
var KeysView = BABB.coreRequire('keysController').KeysView
var PlatformsCollectionView = BABB.coreRequire('platforms').PlatformsCollectionView

exports.FrontendView = Backbone.View.extend({
  
  initialize : function(){        
    this.keysView = new KeysView()
    this.bandanaView = new BandanaView()
    this.platformsCollectionView = new PlatformsCollectionView()    
    //this.romsCollectionView = new RomsCollectionView( {el : $(BABB.RomsConfig.romsContainerId)} )
    this.changeCurrentView(this.platformsCollectionView)
    this.currentValidatedPlatform = null
    this.initBindings()
  },
  
  bindPlatformView : function(){
    var self = this    
    this.platformsCollectionView.on('dynabodyLoaded', function(){
      //self.romsCollectionView.reloadTemplate()
    })
    
    this.platformsCollectionView.on('selectionValidated', function(iPlatform){
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
    
    this.platformsCollectionView.on('back', function(){
      self.changeCurrentView(self.platformsCollectionView)
    })    
    
  },
  
  unbindPlatformView : function(){
    this.platformsCollectionView.off('dynabodyLoaded')
    this.platformsCollectionView.off('selectionValidated')
    this.platformsCollectionView.off('back')
  },
  
  initBindings : function(){
    _.bindAll(this, 'changeCurrentView')    
    var self = this
    
    this.bindPlatformView()
    
    BABB.EventEmitter.on('control-valid', function(){      
      self.currentView.validSelected()
    })
    
    BABB.EventEmitter.on('control-back', function(){      
      self.currentView.back()
    })
    
    BABB.EventEmitter.on('control-next', function(){      
      self.currentView.selectNext()
    })
    
    BABB.EventEmitter.on('control-previous', function(){
      self.currentView.selectPrevious()
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
          var selectedPlatform = self.platformsCollectionView.getSelected()
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
      self.changeCurrentView(self.platformsCollectionView)
    })
    
  },
  
  changeCurrentView : function(iNewCurrentView){        
    if(iNewCurrentView && iNewCurrentView != this.currentView){      
      this.currentView = iNewCurrentView
      if(this.currentView == this.platformsCollectionView){
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
    
    if(iNewCurrentView){
      iNewCurrentView.setSelected(iNewCurrentView.getSelected())
    }
  }
})


