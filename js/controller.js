var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Platforms = require('./platforms');
var Roms = require('./roms');
var Spawner = require('./spawner');
var Path = require('path');

var PlatformsCollectionView = Backbone.View.extend({
	platformsCollection : new Platforms.PlatformsCollection(),
	selectedPlatform: null,
	template : _.template( $(global.BABB.PlatformsConfig.platformsCollectionTemplateId).html() ),
	lastPlatformsContainerFocusTimeoutId : 0,
	validCallback : null,
  backCallback: null,
	  
  initialize : function() {
    var self = this;
    this.el = $(global.BABB.PlatformsConfig.platformsContainerId);
    _.bindAll(this, 'render');
    _.bindAll(this, 'onSniffed');
    _.bindAll(this, 'onSelectedChange');
    _.bindAll(this, 'temporaryFocusContainer');
    
    this.platformsCollection.bind('change', _.throttle(this.render,100));
    this.platformsCollection.bind('add', _.throttle(this.render,100));
    this.platformsCollection.bind('remove', _.throttle(this.render,100));    
    this.el.bind("mousemove", this.temporaryFocusContainer);
    this.el.on("click", ".platform", function(){
      self.setSelected(self.platformsCollection.get(this.id));
    });
    this.el.on("dblclick", ".platform", function(){
      self.validSelected();
    });
	},
  
  doSniff: function(){
    var Sniffer = require('./directory_sniffer');    
    var pathsToSniff = [global.BABB.PlatformsConfig.defaultPlatformsPath];
    Sniffer.stopSniff(pathsToSniff);
    Sniffer.sniff(pathsToSniff, this.onSniffed);    
  },
  
  reset : function(){
    this.platformsCollection.reset();
    this.setSelected(null);
  },
  
  onSniffed : function(parReport){  
    var locSniffedPath = parReport.sniffedPath;
    var locSniffedFilesArray = parReport.sniffedFilesArray;
    
    this.reset();
    for(var i in locSniffedFilesArray){
      var locFileName = locSniffedFilesArray[i];      
      var platform = new Platforms.Platform();
      platform.set({id:platform.cid});
      var filenameParts = Path.basename(locFileName).split('.');
      platform.set({name:filenameParts[0]});
      var pathNormalized = Path.join(locSniffedPath,locFileName);
      pathNormalized = Path.normalize(pathNormalized);
      platform.set({path : pathNormalized});    
      this.platformsCollection.add(platform);
    }
  },
  
  setSelected : function(parPlatform){
    this.selectedPlatform = parPlatform;
    this.onSelectedChange(parPlatform);
  },
  
  onSelectedChange : function (platformEle){
    this.temporaryFocusContainer();
    this.el.children('.focus').removeClass('focus');
    if(platformEle != null){
      console.log('focus ! on '+platformEle.id );
      $('#'+platformEle.id).addClass('focus');
    }
  },
  
  selectNext : function(){
    var next = null;
    if(this.selectedPlatform == null){
      next = this.platformsCollection.first();
    }else{
      var indexSelected = this.platformsCollection.indexOf(this.selectedPlatform);
      next = this.platformsCollection.at(indexSelected + 1 );
    }
    if(next){
      this.setSelected(next);
    }
  },
  
  selectPrevious : function(){
    var previous = null;
    if(this.selectedPlatform == null){
      previous = this.platformsCollection.first();
    }else{
      var indexSelected = this.platformsCollection.indexOf(this.selectedPlatform);
      previous = this.platformsCollection.at(indexSelected - 1 );
    }
    if(previous){
      this.setSelected(previous);
    }
  },
  
  temporaryFocusContainer : function(){
    clearTimeout(this.lastPlatformsContainerFocusTimeoutId);
    this.el.addClass('focus');
    var self = this;
    this.lastPlatformsContainerFocusTimeoutId = setTimeout(function(){self.el.removeClass('focus')},1000);
  },
  
  validSelected : function(){    
    if(this.selectedPlatform){
      var selectedPlatformPath = this.selectedPlatform.get('path');
      if(selectedPlatformPath){
        console.log('selected platform : '+selectedPlatformPath);        
      }
    }
    if(this.validCallback){
      this.validCallback();
    }
  },
  
  back:function(){
    if(this.backCallback){
      this.backCallback();
    }
  },
  
  render : function() {
    console.log('call to platforms render');    
    var renderedContent = this.template({platforms : this.platformsCollection.toArray()});
    $(this.el).html(renderedContent);
    
    return this;
  }
  
});

var RomsCollectionView = Backbone.View.extend({
  romsCollection : new Roms.RomsCollection(),
  selectedRom : null,
  template : _.template( $(global.BABB.RomsConfig.romsCollectionTemplateId).html() ),
  lastRomsContainerFocusTimeoutId : 0,
  validCallback: null,
  backCallback: null,
  
  initialize : function() {
    var self = this;
    this.el = $(global.BABB.RomsConfig.romsContainerId);
    _.bindAll(this, 'render');
    _.bindAll(this, 'onSniffed');
    _.bindAll(this, 'onSelectedChange');
    _.bindAll(this, 'temporaryFocusContainer');
    
    this.romsCollection.bind('change', /*_.throttle(*/this.render/*,100)*/);
    this.romsCollection.bind('add', /*_.throttle(*/this.render/*,100)*/);
    this.romsCollection.bind('remove', /*_.throttle(*/this.render/*,100)*/);    
    this.el.bind("mousemove", this.temporaryFocusContainer);
    this.el.on("click", ".rom", function(){
      self.setSelected(self.romsCollection.get(this.id));
    });
    this.el.on("dblclick", ".rom", function(){
      self.validSelected();
    });
  },
  
  doSniff: function(){
    var Sniffer = require('./directory_sniffer');    
    var snifferInput = $(global.BABB.ServicesConfig.manualSnifferInputId);  
    var pathsToSniff = [global.BABB.ServicesConfig.firstDefaultRomPath];
    if(snifferInput.size() >0){
      pathsToSniff = [snifferInput.val()];
    }
    Sniffer.stopSniff(pathsToSniff);
    Sniffer.sniff(pathsToSniff, this.onSniffed);
  },
  
    
  reset : function(){
    this.romsCollection.reset();
    this.setSelected(null);
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
  },
    
  setSelected : function(parRom){
    this.selectedRom = parRom;
    this.onSelectedChange(parRom);
  },
  
  onSelectedChange : function (romEle){
    this.temporaryFocusContainer();
    this.el.children('.focus').removeClass('focus');
    if(romEle != null){
      console.log('focus ! on '+romEle.id );
      $('#'+romEle.id).addClass('focus');
    }
  },
  
  selectNext : function(){
    var nextRom = null;
    if(this.selectedRom == null){
      nextRom = this.romsCollection.first();
    }else{
      var indexSelected = this.romsCollection.indexOf(this.selectedRom);
      nextRom = this.romsCollection.at(indexSelected + 1 );
    }
    if(nextRom){
      this.setSelected(nextRom);
    }
  },
  
  selectPrevious : function(){
    var previousRom = null;
    if(this.selectedRom == null){
      previousRom = this.romsCollection.first();
    }else{
      var indexSelected = this.romsCollection.indexOf(this.selectedRom);
      previousRom = this.romsCollection.at(indexSelected - 1 );
    }
    if(previousRom){
      this.setSelected(previousRom);
    }
  },
  
  temporaryFocusContainer : function(){
    clearTimeout(this.lastRomsContainerFocusTimeoutId);
    this.el.addClass('focus');
    var self = this;
    this.lastRomsContainerFocusTimeoutId = setTimeout(function(){self.el.removeClass('focus')},1000);
  },
  
  validSelected : function(){    
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
    if (this.validCallback){
      this.validCallback();
    }
  },
  
  back: function(){
    if(this.backCallback){
      this.backCallback();
    }
  },
  
  render : function() {
    console.log('call to roms render');    
    var renderedContent = this.template({roms : this.romsCollection.toArray()});
    $(this.el).html(renderedContent);
    
    return this;
  }
});


var multiRomsCollectionView = new RomsCollectionView();
var platformsCollectionView = new PlatformsCollectionView();
var currentView = platformsCollectionView;

platformsCollectionView.validCallback = function(){
  multiRomsCollectionView.setSelected(null);
  multiRomsCollectionView.selectNext();
  currentView = multiRomsCollectionView;  
}

multiRomsCollectionView.backCallback = function(){
   currentView= platformsCollectionView;
}

global.window.document.onkeydown = applyKey;
function applyKey(keyEvent){
  console.log('keyEvent: '+keyEvent);
  if(keyEvent.keyCode == global.BABB.Controls.up){
    currentView.selectPrevious();
  }
  if(keyEvent.keyCode == global.BABB.Controls.down){
    currentView.selectNext();
  }  
  if(keyEvent.keyCode == global.BABB.Controls.valid){    
    currentView.validSelected();    
  }
  if(keyEvent.keyCode == global.BABB.Controls.back){
    currentView.back();
  }
}

function doSniff(){
  platformsCollectionView.doSniff();
  multiRomsCollectionView.doSniff();    
}

exports.doSniff = doSniff;
