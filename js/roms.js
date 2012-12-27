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
  var msg;
  (parRom != null) ? msg = parRom.toString() : msg = 'null';
  console.log('rom change : '+msg);
  
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

function getSelectedRom(){
  return selectedRom;
}

function selectNextRom(){
  var nextRom = null;
  if(selectedRom == null){
    nextRom = multiRomsCollection.first();
  }else{
    var indexSelected = multiRomsCollection.indexOf(selectedRom);
    nextRom = multiRomsCollection.at(indexSelected + 1 );
  }
  if(nextRom){
    setSelectedRom(nextRom);
  }
}

function selectPreviousRom(){
  var previousRom = null;
  if(selectedRom == null){
    previousRom = multiRomsCollection.first();
  }else{
    var indexSelected = multiRomsCollection.indexOf(selectedRom);
    previousRom = multiRomsCollection.at(indexSelected - 1 );
  }
  if(previousRom){
    setSelectedRom(previousRom);
  }
}

function reset(){
  multiRomsCollection.reset();
  setSelectedRom(null);
}

exports.reset = reset;
exports.selectPreviousRom = selectPreviousRom;
exports.selectNextRom = selectNextRom;
exports.getRomsCollection = getRomsCollection;
exports.getSelectedRom = getSelectedRom;
exports.setSelectedRom = setSelectedRom;
exports.setOnSelectedRomChange = setOnSelectedRomChange;
exports.Rom = Rom;
exports.RomsCollection = RomsCollection;