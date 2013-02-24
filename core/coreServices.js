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

var renderView = function(iPathToView, iContainer$){

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
    })        
  }else if(css){
    iContainer$.append(css)
  }
}

exports.renderPlatformSelectionView = function(iContainer$){
  
}

exports.renderPlatform = function(iPlatform, iContainer$){
  if(iPlatform){
    var basePath = iPlatform.get('path')  
    renderView(basePath, iContainer$)    
  }
}