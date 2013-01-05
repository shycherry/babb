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
  ServicesConfig:{
    firstDefaultRomPath:"c:\\",
    manualSnifferInputId : "#pathToSniff"
  }
};

var Controller = require("./js/controller");

function go(){  
  Controller.doSniff();
}

$(document).ready(go);