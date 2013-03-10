var $ = global.$
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

    if(this.platformModule.getViewName){
      this.set('viewName', this.platformModule.getViewName())
    }else{
      this.set('viewName', BABB.PlatformsConfig.defaultViewName)
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
    var FilenamesFilter = global.BABB.Utils.FilenamesFilter  
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
  
  onSelectedDelegate : function(iPlatform){
    if(this.platformModule.onSelected){
      this.platformModule.onSelected(iPlatform)
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

exports.Platform = Platform
exports.PlatformsCollection = PlatformsCollection
