var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')


exports.ItemsCollectionView = Backbone.View.extend({
   
  bindCoverflow : function(){
    var Coverflow = BABB.coreRequire('coverflow')
    var baseWidth = window.innerWidth/2
    var coverflowModel = new Coverflow.CoverflowModel({
      template : _.template(Fs.readFileSync(__dirname+'/platform-template.html').toString()),
      selectedIndex:0,
      height: window.innerHeight,      
      width : window.innerWidth,
      perspective : baseWidth,
      cellWidth : baseWidth,
      cellHeight : baseWidth,
      coverGap : baseWidth/4,
      coverOffset : baseWidth,
      zUnselected : -baseWidth,
      circularSelection : false,
      virtualSize:10,
      collection : this.itemsCollection,
    })

    this.coverflowView = new Coverflow.CoverflowView({
      el:'#coverflow',
      model : coverflowModel
    })    
    
    var self = this
    this.coverflowView.on('focus', function(iItem){
      self.setSelected(iItem)
    })
    
    this.coverflowView.on('clicked', function(iItem){
      self.trigger('selectionValidated', iItem)
    })
    global.coverflow = this.coverflowView    
  },
  
  doBindings : function(){
    this.bindCoverflow()
    _.bindAll(this, 'bindCoverflow')
    _.bindAll(this, 'render')
    _.bindAll(this, 'onSniffed')
    _.bindAll(this, 'onSelectedChange')
    _.bindAll(this, 'onSelected')
    
    $(window).resize(this.bindCoverflow)
    this.itemsToRender = []
    this.itemsCollection.bind('change', this.render)
    this.itemsCollection.bind('add', _.throttle(this.render,100))
    this.itemsCollection.bind('remove', this.render)
    this.itemsCollection.bind('reset', this.render)
    this.$el.on("click", function(event){
      event.stopPropagation()
    })    
  },
  
  onSelected : function(iItem){
  },
  
  getSelected: function(){
    return this.selectedItem
  },
  
  setSelected : function(iItem){    
    var changed = (this.selectedItem != iItem)
    if(changed){
      this.selectedItem = iItem
      this.onSelectedChange(iItem)      
    }        
    this.onSelected(iItem)
  },
  
  // selectNext : function(){
    // this.coverflowView.Next()    
  // },

  // selectPrevious : function(){
    // this.coverflowView.Previous()
  // },
  
  validSelected : function(){
    this.trigger('selectionValidated', this.selectedItem)
  },

  back:function(){    
    this.trigger('back')
  },
  
  
  render : function() {
    console.log('call to '+this.toString()+' render')
    
    return this
  }
})