﻿var BABB = global.BABB
var Fs = require('fs')
var BasePlatformView = BABB.platformsViewsRequire('base').PlatformView

exports.PlatformView = BasePlatformView.extend({
  
  getCoverflowTemplatePath : function(){
    return __dirname+'/item-template.html'
  },
  
  getHtmlCoverElement : function(iRom){
    return $('#'+iRom.get('id'))
  },
  
  recreateGraphicalRomList : function(iRomsCollection){
    if(iRomsCollection){
      this.romsCollection = iRomsCollection
    }
    
    var Coverflow = BABB.coreRequire('coverflow')
    var baseWidth = window.innerWidth/4
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(this.getCoverflowTemplatePath()).toString()),
      height: window.innerHeight/2,      
      width : window.innerWidth,
      left : window.innerWidth/2,
      top : window.innerHeight/4,
      perspective : baseWidth,
      cellWidth : baseWidth,
      cellHeight : baseWidth*1.5,
      coverGap : baseWidth*1.1,
      coverOffset : baseWidth/4,
      zUnselected : -baseWidth/2,
      circularSelection : true,
      rotateAngleLeft : 0,
      rotateAngleRight : 0,
      virtualSize:10,
      collection : this.romsCollection,
    })

    this.coverflowView = new Coverflow.CoverflowView({
      el:'#romscoverflow',
      model : coverflowModel
    })    
    
    var self = this
    this.coverflowView.on('focus', function(iRom){
      BABB.EventEmitter.trigger('romFocused', iRom)      
    })
    
    this.coverflowView.on('clicked', function(iRom){
      BABB.EventEmitter.trigger('romValidated', iRom)
    })
    
    this.dynabodyPlatform = null
    this.coverflowView.select(this.lastSelectedRomId)    
  },
})
