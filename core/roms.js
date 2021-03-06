﻿var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Sniffer = BABB.coreRequire('sniffer')

var Rom = Backbone.Model.extend({
  defaults: {
    id : "x",
    title : "Rom title",
    path : "/default/path"
  },

  initialize: function Rom(){
    this.set('id', this.cid)
  },

  toString: function(){
    return this.get('title')+' '+this.get('path')
  }
})

var RomsCollection = Backbone.Collection.extend({
  model: Rom,
  initialize: function(){
  }
})

var RomsCollectionView = Backbone.View.extend({
  itemsCollection : new RomsCollection(),

  initialize : function() {
    this.reloadTemplate()
    var self = this

    this.doBindings()
    this.$el.on("click", ".rom", function(event){
      self.setSelected(self.itemsCollection.get(this.id))
      event.stopPropagation()
    })
    this.$el.on("dblclick", ".rom", function(){
      self.validSelected()
    })
  },

  doSniff: function(iPlatform){
    this.reset()
    this.platform = iPlatform
    this.romsProvider = iPlatform.getRomsProviderDelegate()
    this.currentPathsToSniff = iPlatform.getRomsPaths()
    this.stopSniff()
    Sniffer.sniff(iPlatform.getRomsPaths(), this.onSniffed)
  },

  stopSniff : function(){
    Sniffer.stopSniff(this.currentPathsToSniff)
  },

  reloadTemplate : function(){
    this.template = _.template( $(BABB.RomsConfig.romsCollectionTemplateId).html() )
  },

  reset : function(){
    this.itemsCollection.reset()
    this.setSelected(null)
  },

  onSniffed : function(parReport){
    if(parReport.isUpdate){
      this.doSniff(this.platform)
    }else{
      this.romsProvider(parReport, this.itemsCollection)
    }
    if(!this.getSelected()){
      this.selectNext()
    }
  },

  onSelectedChange : function (iRom){
    this.$el.children('.focus').removeClass('focus')
    if(iRom){
      this.temporaryFocusContainer()
      //highlight
      $('#'+iRom.id).addClass('focus')
    }
    this.trigger('selectionChanged', iRom)
  },

  onSelected : function(iRom){
    //delegate focus to platform
    if(this.platform && this.getSelected()){
      this.platform.focusRomDelegate(this.getSelected())
    }
  },

  toString : function() {
    return 'RomsCollectionView'
  }
})

exports.Rom = Rom
exports.RomsCollection = RomsCollection
exports.RomsCollectionView = RomsCollectionView
