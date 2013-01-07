//global definitions
global.$ = $;
global.Backbone = Backbone;
global._ = _;

global.BABB = {
  TestConfig:{
    killidPath: '.\\native_tools\\killid.exe',
  },
  Controls:{
    up: 90, //z
    down: 83, //s
    back: 81, //q
    valid: 68 //d    
  },
  PlatformsConfig:{
    defaultPlatformsPath: ".\\platforms",
    platformsContainerId: "#platforms-container",
    platformsCollectionTemplateId: "#platforms-collection-template"
  },
  RomsConfig:{
    romsContainerId : "#roms-container",
    romsCollectionTemplateId: "#roms-collection-template"
  }, 
};

var Controller = require("./js/controller");
var Gui = require('nw.gui');

function go(){  
  Controller.doSniff();
  Gui.Window.get().show();
}

$(document).ready(go);