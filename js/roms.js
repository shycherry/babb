var $ = global.$;
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

var multiRomsCollection = new RomsCollection();
var selectedRom = null;
var onSelectedRomChange = null;
var eventDispatcher = _.clone(Backbone.Events);

eventDispatcher.on('selectedRomChange', function(parRom){
  console.log('rom change : '+parRom.toString());
  if(onSelectedRomChange){
    onSelectedRomChange(parRom);
  }
});

function setSelectedRom(parRom){
  selectedRom = parRom;
  eventDispatcher.trigger('selectedRomChange', parRom);
}

function setOnSelectedRomChange(parOnRomFocus){
  onSelectedRomChange = parOnRomFocus;
}

function getRomsCollection(){
  return multiRomsCollection;
}

exports.getRomsCollection = getRomsCollection;
exports.setSelectedRom = setSelectedRom;
exports.setOnSelectedRomChange = setOnSelectedRomChange;
exports.Rom = Rom;
exports.RomsCollection = RomsCollection;