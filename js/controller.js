var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;
var romsContainer = $(global.BABB.RomsConfig.romsContainerId);
var romsCollectionTemplate = $('#roms-collection-template');


var Roms = require('./roms');
var Path = require('path');

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
  model: Roms.Rom,
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


var multiRomsCollectionView = new RomsCollectionView({collection : Roms.getRomsCollection()});

Roms.setOnSelectedRomChange(onSelectedRomChange);
function onSelectedRomChange(romEle){
  romsContainer.children('.focus').removeClass('focus');
  if(romEle != null){
    console.log('focus ! on '+romEle.id );      
    $('#'+romEle.id).addClass('focus');
  }
}

romsContainer.on("click", ".rom", function(){  
  Roms.setSelectedRom(Roms.getRomsCollection().get(this.id));
});

romsContainer.on("dblclick", ".rom", function(){
  console.log("dblclick on "+this);
});

global.window.document.onkeydown = applyKey;
function applyKey(keyEvent){
  console.log('keyEvent: '+keyEvent);
  if(keyEvent.keyCode == global.BABB.Controls.up){
    Roms.selectPreviousRom();
  }
  if(keyEvent.keyCode == global.BABB.Controls.down){
    Roms.selectNextRom();
  }
  
}

function doSniff(){
  var Sniffer = require('./directory_sniffer');
  var snifferInput = $(global.BABB.ServicesConfig.manualSnifferInputId);
  Sniffer.stopSniff();
  Sniffer.sniff([snifferInput.val()], onSniffed);
}

function onSniffed(parReport){  
  var locSniffedPath = parReport.sniffedPath;
  var locSniffedFilesArray = parReport.sniffedFilesArray;
  
  Roms.reset();
  for(var i in locSniffedFilesArray){
    var locFileName = locSniffedFilesArray[i];    
    var rom = new Roms.Rom();
    rom.set({id:rom.cid});
    var filenameParts = Path.basename(locFileName).split('.');
    rom.set({title:filenameParts[0]});
    var pathNormalized = Path.join(locSniffedPath,locFileName);
    pathNormalized = Path.normalize(pathNormalized);
    rom.set({path : pathNormalized});    
    Roms.getRomsCollection().add(rom);
  }
  Roms.selectNextRom();
}

function doSpawn(command){
  var spawner = require('./spawner');
  spawner.spawn(command);
}

exports.doSniff = doSniff;
exports.doSpawn = doSpawn;
