var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;
var romsContainer = $(global.BABB.RomsConfig.romsContainerId);
var romsCollectionTemplate = $('#roms-collection-template');

var onRomFocus = null;

romsContainer.on("click", ".rom", function(){
  romsContainer.children('.focus').removeClass('focus');
  $(this).addClass('focus');
  if(onRomFocus){
    onRomFocus(this);
  }
});

romsContainer.on("dblclick", ".rom", function(){
  console.log("dblclick on "+this);
});

function setOnRomFocus(parOnRomFocus){
  onRomFocus = parOnRomFocus;
}

var RomView = Backbone.View.extend({
  el : romsContainer,
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
    var renderedContent = this.template(this.model);
    $(this.el).html(renderedContent)
    return this;
  }
});

var RomsCollectionView = Backbone.View.extend({
  model: Rom,
  el : romsContainer,
  initialize : function() {
    this.template = _.template(romsCollectionTemplate.html());
    
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

exports.setOnRomFocus = setOnRomFocus;
exports.Rom = Rom;
exports.RomView = RomView;
exports.RomsCollection = RomsCollection;
exports.RomsCollectionView = RomsCollectionView;