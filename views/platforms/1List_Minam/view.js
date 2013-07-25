var BABB = global.BABB
var Fs = require('fs')

exports.ViewExtends = '1List'

var BasePlatformView = BABB.platformsViewsRequire(exports.ViewExtends).PlatformView

exports.PlatformView = BasePlatformView.extend({

  recreateGraphicalRomList : function(iRomsCollection){
    if(iRomsCollection){
      this.romsCollection = iRomsCollection
    }

    if(this.coverflowView){
      this.coverflowView.unbindModel()
    }

    var Coverflow = BABB.coreRequire('coverflow')
    var cellWidth = window.innerWidth * (0.205)
    var totalHeight = window.innerHeight * (0.865)
    var coverflowModel = new Coverflow.CoverflowModel({
      orientation : 'vertical',
      template : _.template(Fs.readFileSync(this.getCoverflowTemplatePath()).toString()),
      height: totalHeight,
      width : cellWidth,
      left : cellWidth/2,
      top : (totalHeight/2),
      perspective : 0,
      cellWidth : cellWidth,
      cellHeight : totalHeight/10,
      coverGap : totalHeight/10,
      coverOffset : 0,
      zUnselected : -cellWidth/2,
      circularSelection : true,
      rotateAngleLeft : 0,
      rotateAngleRight : 0,
      virtualSize:5,
      collection : this.romsCollection
    })

    this.coverflowView = new Coverflow.CoverflowView({
      el:'#romscoverflow',
      model : coverflowModel
    })

    BABB.l = this.coverflowView

    var self = this
    this.coverflowView.on('focus', function(iRom){
      BABB.EventEmitter.trigger('romFocused', iRom)
    })

    this.coverflowView.on('clicked', function(iRom){
      BABB.EventEmitter.trigger('romValidated', iRom)
    })

    this.dynabodyPlatform = null
    this.coverflowView.select(this.lastSelectedRomId)
  }

})
