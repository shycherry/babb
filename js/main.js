//global definitions
global.$ = $;
global.Backbone = Backbone;
global._ = _;

global.BABB = {
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
  document.onkeydown = applyKey;
  Controller.doSniff();
}

function applyKey(keyEvent){
  keyEvent.cancelBubble=true;
}

$(document).ready(go);