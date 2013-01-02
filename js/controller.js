var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;
var romsContainer = $(global.BABB.RomsConfig.romsContainerId);
var platformsContainer = $(global.BABB.PlatformsConfig.platformsContainerId);
var platformsCollectionTemplate = $(global.BABB.PlatformsConfig.platformsCollectionTemplateId);


var Roms = require('./roms');
var Spawner = require('./spawner');
var Path = require('path');

var RomsCollectionView = Backbone.View.extend({
  romsCollection : new Roms.RomsCollection(),
  selectedRom : null,
  template : _.template( $(global.BABB.RomsConfig.romsCollectionTemplateId).html() ),
  lastRomsContainerFocusTimeoutId : 0,
  
  initialize : function() {
    var self = this;
    this.el = $(global.BABB.RomsConfig.romsContainerId);
    _.bindAll(this, 'render');
    _.bindAll(this, 'onSniffed');
    _.bindAll(this, 'onSelectedRomChange');
    _.bindAll(this, 'temporaryFocusRomsContainer');
    
    this.romsCollection.bind('change', _.throttle(this.render,100));
    this.romsCollection.bind('add', _.throttle(this.render,100));
    this.romsCollection.bind('remove', _.throttle(this.render,100));    
    this.el.bind("mouseover", this.temporaryFocusRomsContainer);
    this.el.on("click", ".rom", function(){
      self.setSelectedRom(self.romsCollection.get(this.id));
    });
    this.el.on("dblclick", ".rom", function(){
      self.spawnSelectedRom();
    });
  },
  
  doSniff: function(){
    var Sniffer = require('./directory_sniffer');
    Sniffer.stopSniff();
    var snifferInput = $(global.BABB.ServicesConfig.manualSnifferInputId);  
    if(snifferInput.size() >0){
      Sniffer.sniff([snifferInput.val()], onSniffed);
    }else{
      Sniffer.sniff([global.BABB.ServicesConfig.firstDefaultRomPath], this.onSniffed);
    }
  },
  
    
  reset : function(){
    this.romsCollection.reset();
    this.setSelectedRom(null);
  },
  
  onSniffed : function(parReport){  
    var locSniffedPath = parReport.sniffedPath;
    var locSniffedFilesArray = parReport.sniffedFilesArray;
    
    this.reset();
    for(var i in locSniffedFilesArray){
      var locFileName = locSniffedFilesArray[i];    
      var rom = new Roms.Rom();
      rom.set({id:rom.cid});
      var filenameParts = Path.basename(locFileName).split('.');
      rom.set({title:filenameParts[0]});
      var pathNormalized = Path.join(locSniffedPath,locFileName);
      pathNormalized = Path.normalize(pathNormalized);
      rom.set({path : pathNormalized});    
      this.romsCollection.add(rom);
    }
    this.selectNextRom();
  },
  
  selectNextRom : function(){
    var nextRom = null;
    if(this.selectedRom == null){
      nextRom = this.romsCollection.first();
    }else{
      var indexSelected = romsCollection.indexOf(this.selectedRom);
      nextRom = this.romsCollection.at(indexSelected + 1 );
    }
    if(nextRom){
      this.setSelectedRom(nextRom);
    }
  },
  
  setSelectedRom : function(parRom){
    this.selectedRom = parRom;
    this.onSelectedRomChange(parRom);
  },
  
  onSelectedRomChange : function (romEle){
    this.temporaryFocusRomsContainer();
    this.el.children('.focus').removeClass('focus');
    if(romEle != null){
      console.log('focus ! on '+romEle.id );
      $('#'+romEle.id).addClass('focus');
    }
  },
  
  selectNextRom : function(){
    var nextRom = null;
    if(this.selectedRom == null){
      nextRom = this.romsCollection.first();
    }else{
      var indexSelected = this.romsCollection.indexOf(this.selectedRom);
      nextRom = this.romsCollection.at(indexSelected + 1 );
    }
    if(nextRom){
      this.setSelectedRom(nextRom);
    }
  },
  
  selectPreviousRom : function(){
    var previousRom = null;
    if(this.selectedRom == null){
      previousRom = this.romsCollection.first();
    }else{
      var indexSelected = this.romsCollection.indexOf(this.selectedRom);
      previousRom = this.romsCollection.at(indexSelected - 1 );
    }
    if(previousRom){
      this.setSelectedRom(previousRom);
    }
  },
  
  temporaryFocusRomsContainer : function(){
    clearTimeout(this.lastRomsContainerFocusTimeoutId);
    this.el.addClass('focus');
    var self = this;
    this.lastRomsContainerFocusTimeoutId = setTimeout(function(){self.el.removeClass('focus')},1000);
  },
  
  spawnSelectedRom : function(){    
    if(this.selectedRom){
      var selectedRomPath = this.selectedRom.get('path');
      if(selectedRomPath){
        Spawner.spawn(
          global.BABB.TestConfig.platformPath, 
          ['-rp', Path.dirname(selectedRomPath), this.selectedRom.get('title')],
          {cwd : Path.dirname(global.BABB.TestConfig.platformPath)}
        );        
      }
    }
  },
  
  render : function() {
    console.log('call to render');    
    var renderedContent = this.template({roms : this.romsCollection.toArray()});
    $(this.el).html(renderedContent);
    
    return this;
  }
});


var multiRomsCollectionView = new RomsCollectionView();

global.window.document.onkeydown = applyKey;
function applyKey(keyEvent){
  console.log('keyEvent: '+keyEvent);
  if(keyEvent.keyCode == global.BABB.Controls.up){
    multiRomsCollectionView.selectPreviousRom();
  }
  if(keyEvent.keyCode == global.BABB.Controls.down){
    multiRomsCollectionView.selectNextRom();
  }
  
  if(keyEvent.keyCode == global.BABB.Controls.valid){    
    multiRomsCollectionView.spawnSelectedRom();
  }
  
}

function doSniff(){
  multiRomsCollectionView.doSniff();
}

exports.doSniff = doSniff;
