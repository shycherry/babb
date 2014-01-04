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

  // retrieve all parents views pathes
  var hierarchyViewsPathes = []
  hierarchyViewsPathes.push(iPathToView)
  var parentViewName = require(iPathToView+Path.sep+'view.js').ViewExtends
  var parentViewPath = Path.resolve(iPathToView+Path.sep+'..'+Path.sep+parentViewName)
  var moreParents = true
  hierarchyViewsPathes.push(parentViewPath)

  while(moreParents){
    var parentViewFile = parentViewPath+Path.sep+'view.js'
    if(Fs.existsSync(parentViewFile)){
      parentViewName = require(parentViewFile).ViewExtends
      if(parentViewName){
        parentViewPath = Path.resolve(iPathToView+Path.sep+'..'+Path.sep+parentViewName)
        hierarchyViewsPathes.push(parentViewPath)
      }else{
        moreParents = false
      }
    }else{
      moreParents = false
    }
  }

  var arrayCSS = []
  while(hierarchyViewsPathes.length){
    var currentViewPath = hierarchyViewsPathes.pop()
    var viewCSSPath = Path.resolve(currentViewPath+Path.sep+"style.css")
    var css = null

    if(Fs.existsSync(viewCSSPath)){
      viewCSSPath = Path.relative('.'+Path.sep+'core'+Path.sep, viewCSSPath)
      css = $(window.document.createElement('link'))
      css.attr('href', viewCSSPath)
      css.attr('rel', 'stylesheet')
      arrayCSS.push(css)
    }
  }

  var viewLayoutPath = Path.resolve(iPathToView+Path.sep+"layout.html")
  if(Fs.existsSync(viewLayoutPath)){
    viewLayoutPath = Path.relative('.'+Path.sep+'core'+Path.sep, viewLayoutPath)
    var self = this
    iContainer$.load(/*encodeURI*/(viewLayoutPath), function(){
      if(arrayCSS.length){
        iContainer$.append(arrayCSS)
      }
      if(iCallback){iCallback()}
    })
  }else if(arrayCSS.length){
    iContainer$.append(arrayCSS)
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

exports.renderPlatformView = function(iPlatform, iContainer$, iCallback){
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

exports.copyFile = function (iSource, iTarget, iCallback) {
  //create a copy of file
  if(Fs.existsSync(iTarget)){
    Fs.unlinkSync(iTarget);
  }

  var cbCalled = false;

  var rd = Fs.createReadStream(iSource);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = Fs.createWriteStream(iTarget);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      iCallback(err);
      cbCalled = true;
    }
  }
}
