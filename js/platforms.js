var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Path = require('path');
var Fs = require('fs');

var Platform = Backbone.Model.extend({
  defaults: {    
    id : "x",
    name : "Platform name",
    path : "/default/path",    
  },
  
  initialize: function Platform(){
    console.log('Platform constructor');
    var manifest = this.loadModule().manifest;
    this.set({'id':manifest.id});    
  },

  loadModule : function(){
    var modulePath = Path.normalize(this.get('path')+'/platform.js');    
    if(Fs.existsSync(modulePath)){    
      this.module = require('../'+modulePath);    
    }
    return this.module;
  },
  
  doRun : function (){    
    this.loadModule().doRun();
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
