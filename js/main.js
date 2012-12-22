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

var Services = require("./js/services");

function go(){  
  Services.doSniff();
}

$(document).ready(go);