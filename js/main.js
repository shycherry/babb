//global definitions
global.$ = $;
global.Backbone = Backbone;
global._ = _;

global.BABB = {
  Controls:{
    up: 90, //z
    down: 83, //s
    back: 81, //q
    valid: 68 //d    
  },
  RomsConfig:{
    romsContainerId : "#roms-container",
    romsCollectionTemplateId: "#roms-collection-template"
  },
  ServicesConfig:{
    manualSnifferInputId : "#pathToSniff"
  }
};

var Controller = require("./js/controller");

function go(){  
  Controller.doSniff();
}

$(document).ready(go);