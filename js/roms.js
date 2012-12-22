var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Path = require('path');


var RomView = Backbone.View.extend({
  el : $('#roms-container'),
  initialize : function() {
    this.template = _.template($('#rom-template').html());
      
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  },

  setModel : function(model){
    this.model = model;
    return this;
  },
  
  render : function() {
    console.log('call to render');
    var renderedContent = this.template(this.model.toJSON());
    $(this.el).html(renderedContent)
    return this;
  }
});

var RomsCollectionView = Backbone.View.extend({
  model: Rom,
  el : $('#roms-container'),
  initialize : function() {
    this.template = _.template($('#roms-collection-template').html());
    
    _.bindAll(this, 'render');
    this.collection.bind('change', this.render);
    this.collection.bind('add', this.render);
    this.collection.bind('remove', this.render);
  },
  
  render : function() {
    console.log('call to render');
    var renderedContent = this.template({roms : this.collection.toArray()});
    $(this.el).html(renderedContent);
    return this;
  }
});

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
exports.RomView = RomView;
exports.RomsCollection = RomsCollection;
exports.RomsCollectionView = RomsCollectionView;