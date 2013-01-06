﻿var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Path = require('path');
var Fs = require('fs');
var Roms = require('./roms');

var Platform = Backbone.Model.extend({
  defaults: {    
    id : "x",
    name : "unammed platform",
    path : "/default/path",
  },
  
  platformModule : null,
  
  initialize: function Platform(){
    console.log('Platform constructor');
    this.loadModule();
    
    if(this.platformModule.getName){
      this.set({
        'name' : this.platformModule.getName(),
      });    
    }
  },

  loadModule : function(){    
    var modulePath = Path.normalize(this.get('path')+'/platform.js');
    if(Fs.existsSync(modulePath)){    
      this.platformModule = require('../'+modulePath);
    }
    return this.platformModule;
  },
  
  getLogoPath : function(){
    if(this.platformModule.getLogoPath){
      return this.platformModule.getLogoPath();
    }
  },
  
  getRomsPaths : function(){
    if(this.platformModule.getRomsPaths){
      return this.platformModule.getRomsPaths();
    }
    return [];
  },
  
  getRomsProvider: function(){
    if(this.platformModule.romsProvider){
      return this.platformModule.romsProvider;
    }
    return this.defaultRomsProvider;
  },
  
  defaultRomsProvider : function(parReport, oRomsCollection){  
    var locSniffedPath = parReport.sniffedPath;
    var locSniffedFilesArray = parReport.sniffedFilesArray;    
    
    for(var i in locSniffedFilesArray){
      var locFileName = locSniffedFilesArray[i];    
      var rom = new Roms.Rom();
      rom.set({id:rom.cid});
      var filenameParts = Path.basename(locFileName).split('.');
      rom.set({title:filenameParts[0]});
      var pathNormalized = Path.join(locSniffedPath,locFileName);
      pathNormalized = Path.normalize(pathNormalized);
      rom.set({path : pathNormalized});    
      oRomsCollection.add(rom);
    }
  },
  
  runRom : function (parRom){    
    if(this.platformModule.runRom){
      this.platformModule.runRom(parRom);
    }
  },
  
  toString: function(){
    return this.get('name')+' '+this.get('path');
  }
});

var PlatformsCollection = Backbone.Collection.extend({
  model: Platform,
  initialize: function(){
    console.log('PlatformsCollection constructor');
  }
});

exports.Platform = Platform;
exports.PlatformsCollection = PlatformsCollection;
