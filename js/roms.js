﻿var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Rom = Backbone.Model.extend({
  defaults: {    
    id : "x",
    title : "Rom title",
    path : "/default/path",    
  },
  
  initialize: function Rom(){
    console.log('Rom constructor');    
  },
  
  toString: function(){
    return this.get('title')+' '+this.get('path');
  }
});

var RomsCollection = Backbone.Collection.extend({
  model: Rom,
  initialize: function(){
    console.log('RomsCollection constructor');
  }
});


exports.Rom = Rom;
exports.RomsCollection = RomsCollection;