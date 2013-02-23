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

}

exports.renderPlatformSelectionView = function(iContainer$){
  
}

exports.renderPlatform = function(iPlatform, iContainer$){
  if(iPlatform){
  
    //add css ifn
    var platformCSSPath = Path.resolve(iPlatform.get('path')+"/style.css")      
    var css = null
    if(Fs.existsSync(platformCSSPath)){
      platformCSSPath = Path.relative('./core/', platformCSSPath)
      css = $(window.document.createElement('link'))
      css.attr('href', platformCSSPath)
      css.attr('rel', 'stylesheet')          
    }
        
    var platformLayoutPath = Path.resolve(iPlatform.get('path')+"/layout.html")      
    if(Fs.existsSync(platformLayoutPath)){
      platformLayoutPath = Path.relative('./core/', platformLayoutPath)
      var self = this
      // iContainer$.load(encodeURI(platformLayoutPath), function(){            
      iContainer$.load(encodeURI(platformLayoutPath), function(){            
        if(css){
          iContainer$.append(css)
        }
        // self.trigger('dynabodyLoaded')
      })        
    }else if(css){
      iContainer$.append(css)
    }
    
  }
}