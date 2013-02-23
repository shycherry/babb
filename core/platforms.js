﻿var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Path = require('path')
var Fs = require('fs')
var Sniffer = BABB.coreRequire('sniffer')
var Roms = BABB.coreRequire('roms')

var ItemsCollectionView = BABB.coreRequire('itemsCollection').ItemsCollectionView

var Platform = Backbone.Model.extend({
  defaults: {    
    id : "x",
    name : "unammed platform",
    path : "/default/path",
  },
  
  platformModule : null,
  
  initialize: function Platform(){
    console.log('Platform constructor')
    this.set('id', this.cid)
    this.loadModule()
    
    if(this.platformModule.getName){
      this.set('name', this.platformModule.getName())
    }
  },

  loadModule : function(){    
    var modulePath = Path.normalize(this.get('path')+'/platform.js')
    if(Fs.existsSync(modulePath)){    
      this.platformModule = require('../'+modulePath)
    }
    return this.platformModule
  },
  
  getLogoPathDelegate : function(){
    if(this.platformModule.getLogoPath){
      return this.platformModule.getLogoPath()
    }
  },
  
  getRomsPaths : function(){
    if(this.platformModule.getRomsPaths){
      return this.platformModule.getRomsPaths()
    }
    return []
  },
  
  getRomsProviderDelegate: function(){
    if(this.platformModule.romsProvider){
      return this.platformModule.romsProvider
    }
    return this.defaultRomsProvider
  },
  
  defaultRomsProvider : function(parReport, oRomsCollection){  
    var FilenamesFilter = global.BABB.Libs.FilenamesFilter  
    var filteredFilesMap = new FilenamesFilter(parReport)        
        .onlyKeepBasename()
        .removeExtensions()
        .get()

    for(var locPath in filteredFilesMap){
      var rom = new Roms.Rom({
        title : filteredFilesMap[locPath],
        path : locPath
      })    
      oRomsCollection.add(rom)
    }
    
  },
  
  focusRomDelegate : function(parRom){
    if(this.platformModule.focusRom){
      this.platformModule.focusRom(parRom)
    }else{
      console.log('no focusRom method defined for '+this)
    }
  },
  
  onSelectedDelegate : function(){
    if(this.platformModule.onSelected){
      this.platformModule.onSelected()
    }else{
      console.log('no onSelected method defined for '+this)
    }
  },
  
  runRomDelegate : function (parRom){    
    if(this.platformModule.runRom){
      this.platformModule.runRom(parRom)
    }else{
      console.log('no runRom method defined for '+this)
    }
  },
  
  isAvailableDelegate : function (){
    if(this.platformModule.isAvailable){
      return this.platformModule.isAvailable()
    }
    return true;
  },
  
  toString: function(){
    return this.get('name')+' ('+this.get('path')+')'
  }
})

var PlatformsCollection = Backbone.Collection.extend({
  model: Platform,
  initialize: function(){
    console.log('PlatformsCollection constructor')    
  }
})

var PlatformsCollectionView = ItemsCollectionView.extend({
	itemsCollection : new PlatformsCollection(),		
	
  initialize : function() {
    console.log('PlatformsCollectionView initialize')    
    this.doBindings()
    this.doSniff()
	},
  
  doSniff: function(){
    this.reset()
    var pathsToSniff = [BABB.PlatformsConfig.defaultPlatformsPath]
    Sniffer.stopSniff(pathsToSniff)
    Sniffer.sniff(pathsToSniff, this.onSniffed)
  },

  reset : function(){    
    this.itemsCollection.reset()
    this.setSelected(null)
  },
  
  onSniffed : function(parReport){
	if(parReport.isUpdate){
      this.doSniff()
    }else{
      for(locSniffedPath in parReport){
        var locSniffedFilesArray = parReport[locSniffedPath]

        for(var i in locSniffedFilesArray){
          var locFileName = locSniffedFilesArray[i]
          var pathNormalized = Path.join(locSniffedPath,locFileName)
          pathNormalized = Path.normalize(pathNormalized)
          if(Fs.existsSync(pathNormalized+'/platform.js')){
            var platform = new Platform({path : pathNormalized})            
            this.itemsCollection.add(platform)
          }
        }
      }
      if(!this.getSelected()){
        this.selectNext()
      }      
    }    
  },
  
  onSelectedChange : function (iItem){    
    clearTimeout(this.lastFocusTimeoutId)
    var self = this
    this.lastFocusTimeoutId = setTimeout(function(){
      self.dynabodyItem = iItem
      self.loadDynabody(iItem)
    },800)    
    
  },
  
  validSelected : function(){
    if(this.dynabodyItem && this.dynabodyItem != this.selectedItem){
      loadDynabody(this.selectedItem);
    }
    this.trigger('selectionValidated', this.selectedItem)
  },
  
  loadDynabody : function(iItem){
    if(iItem){           
      //detach dynabodies
      $('.coverflow-cell #dynabody').detach()        
      
      //change dynabody
      var focusedCell = $('.coverflow-cell.focus')
      
      var dynabody = $(window.document.createElement('div'))
      dynabody.attr('id', 'dynabody')
      if(! iItem.isAvailableDelegate()){
        dynabody.addClass('unavailable')
      }
      
      //add css ifn
      var platformCSSPath = Path.resolve(iItem.get('path')+"/style.css")      
      var css = null
      if(Fs.existsSync(platformCSSPath)){
        platformCSSPath = Path.relative('./core/', platformCSSPath)
        css = $(window.document.createElement('link'))
        css.attr('href', platformCSSPath)
        css.attr('rel', 'stylesheet')          
      }
          
      var platformDynaBodyPath = Path.resolve(iItem.get('path')+"/layout.html")      
      if(Fs.existsSync(platformDynaBodyPath)){
        platformDynaBodyPath = Path.relative('./core/', platformDynaBodyPath)
        var self = this
        dynabody.load(encodeURI(platformDynaBodyPath), function(){            
          if(css){
            dynabody.append(css)
          }
          self.trigger('dynabodyLoaded')
        })        
      }else if(css){
        dynabody.append(css)
      }
      
      dynabody.insertBefore(focusedCell.children().first())
    }
  },

  toString : function(){
    return 'PlatformsCollectionView'
  }

})

exports.Platform = Platform
exports.PlatformsCollection = PlatformsCollection
exports.PlatformsCollectionView = PlatformsCollectionView
