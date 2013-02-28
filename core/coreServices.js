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

var renderView = function(iPathToView, iContainer$, iCallback){

  var viewCSSPath = Path.resolve(iPathToView+"/style.css")      
  var css = null
  if(Fs.existsSync(viewCSSPath)){
    viewCSSPath = Path.relative('./core/', viewCSSPath)
    css = $(window.document.createElement('link'))
    css.attr('href', viewCSSPath)
    css.attr('rel', 'stylesheet')          
  }
      
  var viewLayoutPath = Path.resolve(iPathToView+"/layout.html")      
  if(Fs.existsSync(viewLayoutPath)){
    viewLayoutPath = Path.relative('./core/', viewLayoutPath)
    var self = this
    iContainer$.load(encodeURI(viewLayoutPath), function(){            
      if(css){
        iContainer$.append(css)
      }
      if(iCallback){iCallback()}
    })        
  }else if(css){
    iContainer$.append(css)
    if(iCallback){iCallback()}
  }else{
    if(iCallback){iCallback()}
  }
}

exports.renderPlatformSelectionView = function(iContainer$, iCallback){
  var platformSelectionViewPath = './views/platformSelectionViews/'+BABB.PlatformSelectionConfig.viewName
  if(!iContainer$){
    iContainer$ = $('#platformSelectionContainer')
  }
  renderView(platformSelectionViewPath, iContainer$, iCallback)
}

exports.renderPlatform = function(iPlatform, iContainer$, iCallback){
  if(iPlatform){
    var basePath = iPlatform.get('path')  
    if(!iContainer$){
      iContainer$ = $('#platformContainer')
    }
    renderView(basePath, iContainer$, iCallback)    
  }
}

exports.setVisiblePlatformSelectionView = function(isVisible){
  if(isVisible){
    $('#platformSelectionContainer').show()
  }else{
    $('#platformSelectionContainer').hide()
  }
}

exports.setVisiblePlatformView = function(isVisible){
  if(isVisible){
    $('#platformContainer').show()
  }else{
    $('#platformContainer').hide()
  }
}
