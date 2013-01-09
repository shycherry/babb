var $ = global.$;
var Backbone = global.Backbone;
var _ = global._;

var Platforms = require('./platforms');
var Roms = require('./roms');
var Spawner = require('./spawner');
var Path = require('path');
var Fs = require('fs');

var PlatformsCollectionView = Backbone.View.extend({
	platformsCollection : new Platforms.PlatformsCollection(),
	selectedPlatform: null,
	template : _.template( $(global.BABB.PlatformsConfig.platformsCollectionTemplateId).html() ),
	lastPlatformsContainerFocusTimeoutId : 0,
	validCallback : null,
  backCallback: null,
  selectCallback: null,
	  
  initialize : function() {
    console.log('PlatformsCollectionView initialize');
    var self = this;
    this.el = $(global.BABB.PlatformsConfig.platformsContainerId);
    _.bindAll(this, 'render');
    _.bindAll(this, 'onSniffed');
    _.bindAll(this, 'onSelectedChange');
    _.bindAll(this, 'temporaryFocusContainer');    
    this.platformsCollection.bind('change', /*_.throttle(*/this.render/*,100)*/);
    this.platformsCollection.bind('add', /*_.throttle(*/this.render/*,100)*/);
    this.platformsCollection.bind('remove', /*_.throttle(*/this.render/*,100)*/);    
    this.el.bind("mousemove", this.temporaryFocusContainer);    
    this.el.on("click", function(event){      
      event.stopPropagation();
    });
    this.el.on("click", ".platform", function(event){
      self.setSelected(self.platformsCollection.get(this.id));
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
    this.reset();
    for(locSniffedPath in parReport){      
      var locSniffedFilesArray = parReport[locSniffedPath];
      
      for(var i in locSniffedFilesArray){      
        var locFileName = locSniffedFilesArray[i];      
        var pathNormalized = Path.join(locSniffedPath,locFileName);
        pathNormalized = Path.normalize(pathNormalized);      
        if(Fs.existsSync(pathNormalized+'/platform.js')){
          var platform = new Platforms.Platform({path : pathNormalized});
          platform.set({id:platform.cid});
          this.platformsCollection.add(platform);
        }
      }
    }
    
    if(!this.getSelected()){
      this.selectNext();
    }
  },
  
  getSelected: function(){
    return this.selectedPlatform;
  },
  
  setSelected : function(parPlatform){
    var changed = (this.selectedPlatform != parPlatform);    
    if(changed){
      this.selectedPlatform = parPlatform;
      this.onSelectedChange(parPlatform);
    }
  },
  
  onSelectedChange : function (platformEle){    
    this.el.children('.focus').removeClass('focus');
    if(platformEle){
      this.temporaryFocusContainer();
      
      //highlight      
      $('#'+platformEle.id).addClass('focus');
      
      //change CSS
      var oldCSSPlatform = $('#CSS-Platform');
      oldCSSPlatform.attr('href', '');
      var platformCSSPath = Path.normalize(platformEle.get('path')+"/style.css");
      if(Fs.existsSync(platformCSSPath)){
        oldCSSPlatform.attr('href', platformCSSPath);
      }
      
      //change dynabody
      var dynabody = $('#dynabody');
      dynabody.children().remove();
      var platformDynaBodyPath = Path.normalize(platformEle.get('path')+"/layout.html");
      if(Fs.existsSync(platformDynaBodyPath)){
        dynabody.load(platformDynaBodyPath);
      }
    }
    if(this.selectCallback){
      this.selectCallback(platformEle);
    }
  },
  
  selectNext : function(){
    var next = null;
    if(this.selectedPlatform == null){
      next = this.platformsCollection.first();
    }else{
      var indexSelected = this.platformsCollection.indexOf(this.selectedPlatform);
      next = this.platformsCollection.at((indexSelected + 1) % this.platformsCollection.size() );
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
      previous = this.platformsCollection.at((indexSelected + this.platformsCollection.size() - 1) % this.platformsCollection.size() );
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
  
  unfocusContainer : function(){
    clearTimeout(this.lastRomsContainerFocusTimeoutId);
    this.el.removeClass('focus');
  },
  
  validSelected : function(){    
    if(this.selectedPlatform){
      var selectedPlatformPath = this.selectedPlatform.get('path');
      if(selectedPlatformPath){
        console.log('selected platform : '+selectedPlatformPath);        
      }
    }
    if(this.validCallback){
      this.validCallback(this.selectedPlatform);
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
  selectCallback: null,
  currentPathsToSniff : null,
  romsProvider: null,
  
  initialize : function() {
    console.log('RomsCollectionView initialize');
    var self = this;
    this.el = $(global.BABB.RomsConfig.romsContainerId);
    _.bindAll(this, 'render');
    _.bindAll(this, 'onSniffed');
    _.bindAll(this, 'onSelectedChange');
    _.bindAll(this, 'temporaryFocusContainer');
    
    this.romsCollection.bind('change', _.throttle(this.render,100));
    this.romsCollection.bind('add', _.throttle(this.render,100));
    this.romsCollection.bind('remove', _.throttle(this.render,100));    
    this.romsCollection.bind('reset', _.throttle(this.render,100));    
    this.el.bind("mousemove", this.temporaryFocusContainer);
    this.el.on("click", function(event){      
      event.stopPropagation();
    });
    this.el.on("click", ".rom", function(event){
      self.setSelected(self.romsCollection.get(this.id));
      event.stopPropagation();
    });
    this.el.on("mousewheel", function(event){      
      event.stopPropagation();
    });
    this.el.on("dblclick", ".rom", function(){
      self.validSelected();
    });
  },
  
  doSniff: function(parPlatform){
    this.reset();
    var romsPaths = parPlatform.getRomsPaths();
    this.romsProvider = parPlatform.getRomsProvider();
    var Sniffer = require('./directory_sniffer');    
    Sniffer.stopSniff(this.currentPathsToSniff);    
    Sniffer.sniff(romsPaths, this.onSniffed);
    this.currentPathsToSniff = romsPaths;
  },
  
    
  reset : function(){
    this.template = _.template( $(global.BABB.RomsConfig.romsCollectionTemplateId).html() );
    this.romsCollection.reset();
    this.setSelected(null);
  },
  
  onSniffed : function(parReport){  
    this.reset();
    this.romsProvider(parReport, this.romsCollection);    
  },
  
  getSelected : function(){
    return this.selectedRom;
  },
      
  setSelected : function(parRom){
    var changed = (this.selectedRom != parRom);    
    if(changed){
      this.selectedRom = parRom;
      this.onSelectedChange(parRom);
    }
  },
  
  onSelectedChange : function (romEle){
    this.el.children('.focus').removeClass('focus');
    if(romEle){
      this.temporaryFocusContainer();      
      $('#'+romEle.id).addClass('focus');
    }
    if(this.selectCallback){
      this.selectCallback(romEle);
    }
  },
  
  selectNext : function(){
    var nextRom = null;
    if(this.selectedRom == null){
      nextRom = this.romsCollection.first();
    }else{
      var indexSelected = this.romsCollection.indexOf(this.selectedRom);
      nextRom = this.romsCollection.at((indexSelected + 1) % this.romsCollection.size() );      
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
      previousRom = this.romsCollection.at((indexSelected + this.romsCollection.size() - 1) % this.romsCollection.size() );     
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
  
  unfocusContainer : function(){
    clearTimeout(this.lastRomsContainerFocusTimeoutId);
    this.el.removeClass('focus');
  },
  
  validSelected : function(){    
    if (this.validCallback){
      this.validCallback(this.selectedRom);
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


var romsCollectionView = new RomsCollectionView();
var platformsCollectionView = new PlatformsCollectionView();
var currentView = null;
changeCurrentView(platformsCollectionView);

function changeCurrentView(parNewCurrentView){
  if(parNewCurrentView && parNewCurrentView != currentView){
    if(currentView){
      currentView.unfocusContainer();
    }
    currentView = parNewCurrentView;    
    currentView.temporaryFocusContainer();
    if(currentView == platformsCollectionView){
      $('#dynabody').removeClass('parallax');
      $(global.BABB.RomsConfig.romsContainerId).addClass('hidden');
      $(global.BABB.PlatformsConfig.platformsContainerId).removeClass('hidden');
    }
    else if(currentView == romsCollectionView){
      $('#dynabody').addClass('parallax');
      $(global.BABB.PlatformsConfig.platformsContainerId).addClass('hidden');
      $(global.BABB.RomsConfig.romsContainerId).removeClass('hidden');
    }
  }else if(currentView){
    currentView.temporaryFocusContainer();
  }
}

$('body').on("click", function(event){
  if(currentView == platformsCollectionView){
    currentView.validSelected();
  }
  else if(currentView == romsCollectionView){
    currentView.back();
  }
});

$('body').on("mousewheel", function(event, delta){

  var delta = event.originalEvent.wheelDelta;
  if(delta < 0){
    currentView.selectNext();
  }else{
    currentView.selectPrevious();
  }      
  
});

platformsCollectionView.selectCallback = function(parPlatform){
  if(parPlatform){
    changeCurrentView(platformsCollectionView);    
    romsCollectionView.doSniff(parPlatform);
    romsCollectionView.setSelected(null);
  }
}

romsCollectionView.selectCallback = function(){
  console.log('roms select callback');
  if(romsCollectionView.getSelected()){
    changeCurrentView(romsCollectionView);
  }
}

platformsCollectionView.validCallback = function(parPlatform){  
  changeCurrentView(romsCollectionView);
  if( ! currentView.getSelected()){
    currentView.selectNext();
  }
}

platformsCollectionView.backCallback = function(){  
  changeCurrentView(platformsCollectionView);
}

romsCollectionView.validCallback = function(parRom){
  if($(global.BABB.RomsConfig.romsContainerId).hasClass('focus')){
    if(parRom){
      var selectedPlatform = platformsCollectionView.getSelected();
      if(selectedPlatform){
        selectedPlatform.runRom(parRom);
      }
    }
  }else{
    changeCurrentView(romsCollectionView);
  }
}

romsCollectionView.backCallback = function(){  
  changeCurrentView(platformsCollectionView);
}

global.window.document.onkeydown = applyKey;
function applyKey(keyEvent){
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
}

exports.doSniff = doSniff;
