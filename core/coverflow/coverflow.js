﻿var $ = global.$
var _ = global._
var Backbone = global.Backbone
var Fs = require('fs')

/*
* events : clicked, focus
*/

var CoverflowModel = Backbone.Model.extend({
  defaults:{
    orientation:'horizontal',
    left: 240,
    top: 135,
    virtualSize:2,
    width:480,
    height:270,
    cellWidth:180,
    cellHeight:180,
    selectedIndex:-1,
    zUnselected:-170,
    perspective:250,
    coverGap:40,
    coverOffset:130,
    rotateAngleLeft:70,
    rotateAngleRight:-70,
    circularSelection:false,
    collection : new Backbone.Collection(),
    template: _.template(Fs.readFileSync(__dirname+'/default-template.html').toString())
  }
})

var CoverflowView = Backbone.View.extend({

  initialize : function(){
    if(!this.model){
      this.model = new CoverflowModel()
    }
    this.initFromModel()
    this.createDOM()
    this.recreateFullDOMCollection()
    this.render()
    this.initBindings()
  },

  initFromModel : function(){
    this.left = this.model.get('left')
    this.top = this.model.get('top')
    this.orientation = this.model.get('orientation')
    this.template = this.model.get('template')
    this.collection = this.model.get('collection')
    this.circularSelection = this.model.get('circularSelection')
    this.selectedIndex = this.model.get('selectedIndex') - 0
    this.previousSelectedIndex = this.selectedIndex
    this.cellWidth = this.model.get('cellWidth')
    this.cellHeight = this.model.get('cellHeight')
    this.zUnselected = this.model.get('zUnselected')
    this.height = this.model.get('height')
    this.width = this.model.get('width')
    this.perspective = this.model.get('perspective')
    this.coverGap = this.model.get('coverGap')
    this.coverOffset = this.model.get('coverOffset')
    this.virtualSize = this.model.get('virtualSize')
    this.rotateAngleLeft = this.model.get('rotateAngleLeft')
    this.rotateAngleRight = this.model.get('rotateAngleRight')
  },

  initBindings : function(){
    var self = this
    _.bindAll(this, 'render')
    _.bindAll(this, 'recreateFullDOMCollection')
    this.collection.on('change', this.recreateFullDOMCollection, this)
    this.collection.on('add', _.throttle(this.recreateFullDOMCollection,100), this)
    this.collection.on('remove', this.recreateFullDOMCollection, this)
    this.collection.on('reset', this.recreateFullDOMCollection, this)
    this.on('focus', this.render, this)
    this.$el.on("mousewheel", function(event, delta){

      var locDelta = event.originalEvent.wheelDelta
      if(locDelta < 0){
        self.Next()
      }else{
        self.Previous()
      }

    })
  },

  unbindModel : function(){
    this.collection.off(null, null, this)
  },

  add : function(iItem){
    this.collection.add(iItem)
    this.recreateFullDOMCollection()
    this.render()
  },

  addAll : function(iArray){
    this.collection.add(iArray)
    this.recreateFullDOMCollection()
    this.render()
  },

  setCollection : function(iArray){
    this.collection.reset()
    this.collection.add(iArray)
    this.recreateFullDOMCollection()
    this.render()
  },

  getSelected : function(){
    return this.collection.at(this.selectedIndex)
  },

  select : function(iIndex){
    if(iIndex >= 0 && iIndex < this.collection.length){
      this.previousSelectedIndex = this.selectedIndex
      this.selectedIndex = iIndex
      if(this.selectedIndex != this.previousSelectedIndex){
        if(Math.abs(this.selectedIndex - this.previousSelectedIndex) >1){
          this.needFullRender = true
        }

        this.trigger('focus', this.getSelected())
      }
    }
  },

  Next : function(){
    if(this.selectedIndex < 0){
      this.select(0)
    }else{
      this.select( this.getNextIndex(this.selectedIndex) )
    }
  },

  Previous : function(){
    if(this.selected < 0){
      this.select(0)
    }else{
      this.select( this.getPreviousIndex(this.selectedIndex) )
    }
  },

  getNextIndex : function(baseIndex){
    if(this.circularSelection){
      return (baseIndex + 1) % this.collection.size()
    }else{
      return this.selectedIndex+1
    }
  },

  getPreviousIndex : function(baseIndex){
    if(this.circularSelection){
      return (baseIndex + this.collection.size() - 1) % this.collection.size()
    }else{
      return this.selectedIndex-1
    }
  },

  createDOM : function(){
    this.$divWrap = $(window.document.createElement('div'))
    this.$divTray = $(window.document.createElement('div'))
    this.$divWrap.addClass('coverflow-wrap')
    this.$divTray.addClass('coverflow-tray')
    this.$divWrap.append(this.$divTray)
    this.$divWrap.css('-webkit-perspective', this.perspective+'px')
    this.$divWrap.css('left', this.left+'px')
    this.$divWrap.css('top', this.top+'px')
    this.$el.html(this.$divWrap)
    this.$el.addClass('coverflow')
    this.$el.css('width', this.width)
    this.$el.css('height', this.height)
    this.recreateFullDOMCollection()
  },

  createCellDOM : function(iItem, iCellIndex){
    var self = this
    var $div = $(window.document.createElement('div'))
    $div.on('click', function(){
      var clickedIndex = this.getAttribute('index') - 0
      if(clickedIndex != self.selectedIndex){
        self.select(clickedIndex)
      }else{
        self.trigger('clicked', self.getSelected())
      }
    })

    $div.css('height',self.cellHeight+'px')
    $div.css('width',self.cellWidth+'px')
    $div.css('left',-self.cellWidth/2+'px')
    $div.css('top',-self.cellHeight/2+'px')
    $div.html(self.template({item:iItem}))
    $div.addClass('coverflow-cell')

    $div.attr('index',iCellIndex)

    this.styliseCell($div)

    return $div
  },

  styliseCell : function(iCell){
    var cellIndex = iCell.attr('index')
    if(cellIndex < this.selectedIndex){
      if('horizontal' == this.orientation){
        iCell.css('-webkit-transform',' translate3d('+(-this.coverOffset+(cellIndex*this.coverGap))+'px, 0px, '+this.zUnselected+'px) rotateY('+this.rotateAngleLeft+'deg)')
      }else{
        iCell.css('-webkit-transform',' translate3d(0px,'+(this.coverOffset+(cellIndex*this.coverGap))+'px, '+this.zUnselected+'px) rotateX('+this.rotateAngleLeft+'deg)')
      }
      iCell.removeClass('focus')
    }else if(cellIndex == this.selectedIndex){
      if('horizontal' == this.orientation){
        iCell.css('-webkit-transform','translate3d('+this.coverGap*cellIndex+'px,0px,0px)')
      }else{
        iCell.css('-webkit-transform','translate3d(0px,'+this.coverGap*cellIndex+'px,0px)')
      }
      iCell.addClass('focus')
    }else if(cellIndex > this.selectedIndex){
      if('horizontal' == this.orientation){
        iCell.css('-webkit-transform','translate3d('+(this.coverOffset+(cellIndex*this.coverGap))+'px, 0px, '+this.zUnselected+'px) rotateY('+this.rotateAngleRight+'deg)')
      }else{
        iCell.css('-webkit-transform','translate3d(0px, '+(this.coverOffset+(cellIndex*this.coverGap))+'px, '+this.zUnselected+'px) rotateX('+this.rotateAngleRight+'deg)')
      }
      iCell.removeClass('focus')
    }
  },

  recreateFullDOMCollection: function(){
    var self = this
    this.$divTray.empty()
    var startIndex = Math.max((this.selectedIndex-this.virtualSize), 0)
    var endIndex = Math.min((this.selectedIndex+this.virtualSize),this.collection.length -1)

    for(var i = startIndex; i<= endIndex; i++){
      var $div = self.createCellDOM(this.collection.at(i), i)
      self.$divTray.append($div)
    }
    this.needFullRender = true
  },

  virtualizeDOM : function(){
    var flow = this.selectedIndex - this.previousSelectedIndex
    var domCells = this.$divTray.children()
    var domCellsCount = domCells.size()
    var domCellFirst = domCells.first()
    var domCellLast = domCells.last()
    var domCellsFirstIdx = domCellFirst.attr('index') - 0
    var domCellsLastIdx = domCellLast.attr('index') - 0

    if(Math.abs(flow) > this.virtualSize){

      this.recreateFullDOMCollection()

    }else{

      var nbCellsToRemove
      var nbCellsToAdd
      var itemToAdd
      var divToAdd
      var indexToAdd
      var idx

      if(flow<0){
        // on recule
        nbCellsToRemove = (domCellsLastIdx - this.selectedIndex) - this.virtualSize
        for(idx=0; idx< nbCellsToRemove; idx++){
          domCells[domCellsCount-idx-1].remove()
        }

        nbCellsToAdd = this.virtualSize - (this.selectedIndex - domCellsFirstIdx)
        for(idx=0; idx<nbCellsToAdd; idx++){
          indexToAdd = domCellsFirstIdx-idx-1
          if(indexToAdd >= 0){
            itemToAdd = this.collection.at(indexToAdd)
            divToAdd = this.createCellDOM(itemToAdd, indexToAdd)
            divToAdd.insertBefore(domCellFirst)
            domCellFirst = divToAdd
          }
        }
      }else{
        //on avance
        nbCellsToRemove = (this.selectedIndex - domCellsFirstIdx) - this.virtualSize
        for(idx=0; idx< nbCellsToRemove; idx++){
          domCells[idx].remove()
        }

        nbCellsToAdd = this.virtualSize - (domCellsLastIdx - this.selectedIndex)
        for(idx=0; idx<nbCellsToAdd; idx++){
          indexToAdd = domCellsLastIdx+idx+1
          if(indexToAdd < this.collection.length){
            itemToAdd = this.collection.at(indexToAdd)
            divToAdd = this.createCellDOM(itemToAdd, indexToAdd)
            divToAdd.insertAfter(domCellLast)
            domCellLast = divToAdd
          }
        }
      }

    }

  },

  renderFull : function(){
    if('horizontal' == this.orientation){
      this.$divTray.css('-webkit-transform', 'translate3d(-'+(this.coverGap*this.selectedIndex)+'px , 0px, 0px)')
    }else{
      this.$divTray.css('-webkit-transform', 'translate3d(0px , -'+(this.coverGap*this.selectedIndex)+'px, 0px)')
    }
    var collectionLength = this.collection.length
    for(var i = 0; i< collectionLength; i++){
      var element = $(this.$divTray.children()[i])
      this.styliseCell(element)
    }

    this.needFullRender = false
  },

  renderFast : function(){
    if('horizontal' == this.orientation){
      this.$divTray.css('-webkit-transform', 'translate3d(-'+(this.coverGap*this.selectedIndex)+'px , 0px, 0px)')
    }else{
      this.$divTray.css('-webkit-transform', 'translate3d(0px , -'+(this.coverGap*this.selectedIndex)+'px, 0px)')
    }

    var selectedElement = $(this.$divTray.children('[index='+this.selectedIndex+']'))
    this.styliseCell(selectedElement)

    var previousSelectedElement = $(this.$divTray.children('[index='+this.previousSelectedIndex+']'))
    this.styliseCell(previousSelectedElement)
  },

  render : function(){
    this.virtualizeDOM()
    if(this.needFullRender){
      this.renderFull()
    }else{
      this.renderFast()
    }
  }
})

exports.CoverflowModel = CoverflowModel
exports.CoverflowView = CoverflowView