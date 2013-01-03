var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Platform = Backbone.Model.extend({
  defaults: {    
    id : "x",
    name : "Platform name",
    path : "/default/path",    
  },
  
  initialize: function Platform(){
    console.log('Platform constructor');    
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
