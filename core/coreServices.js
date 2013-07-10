var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')
var Path = require('path')
var Sniffer = BABB.coreRequire('sniffer')
var RomsCollectionView = BABB.coreRequire('roms').RomsCollectionView
var KeysView = BABB.coreRequire('keysController').KeysView

var platformSelectionContainerDOM = null
var platformContainerDOM = null

var renderView = function(iPathToView, iContainer$, iCallback){

  var viewCSSPath = Path.resolve(iPathToView+Path.sep+"style.css")
  var css = null
  if(Fs.existsSync(viewCSSPath)){
    viewCSSPath = Path.relative('.'+Path.sep+'core'+Path.sep, viewCSSPath)
    css = $(window.document.createElement('link'))
    css.attr('href', viewCSSPath)
    css.attr('rel', 'stylesheet')
  }

  var viewLayoutPath = Path.resolve(iPathToView+Path.sep+"layout.html")
  if(Fs.existsSync(viewLayoutPath)){
    viewLayoutPath = Path.relative('.'+Path.sep+'core'+Path.sep, viewLayoutPath)
    var self = this
    iContainer$.load(/*encodeURI*/(viewLayoutPath), function(){
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
  var platformSelectionViewPath = BABB.platformSelectionViewLayoutPath(BABB.PlatformSelectionConfig.viewName)
  if(!iContainer$){
    iContainer$ = $('#platformSelectionContainer')
  }
  renderView(platformSelectionViewPath, iContainer$, iCallback)
}

exports.renderPlatform = function(iPlatform, iContainer$, iCallback){
  if(iPlatform){
    var basePath = BABB.platformViewLayoutPath(iPlatform.get('viewName'))
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

exports.clearPlatformSelectionContainer = function(){
  $('body #platformSelectionContainer').children().remove()
}

exports.clearPlatformContainer = function(){
  $('body #platformContainer').children().remove()
}

exports.attachPlatformSelectionContainer = function(){
  if(platformSelectionContainerDOM){
    $('body').append(platformSelectionContainerDOM)
    platformSelectionContainerDOM = null
  }
}

exports.detachPlatformSelectionContainer = function(){
  platformSelectionContainerDOM = $('body #platformSelectionContainer').toArray()
  $('body #platformSelectionContainer').detach()
}

exports.attachPlatformContainer = function(){
  if(platformContainerDOM){
    $('body').append(platformContainerDOM)
    platformContainerDOM = null
  }
}

exports.detachPlatformContainer = function(){
  platformContainerDOM = $('body #platformContainer').toArray()
  $('body #platformContainer').detach()
}

exports.sniffPlatformsRoms = function(iPlatforms, iCallback){

}
