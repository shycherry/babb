var BABB = global.BABB
var Fs = require('fs')
var History = require('./history.js')
var KeysController = BABB.coreRequire('keysController')

var BasePlatformView = BABB.platformsViewsRequire('default').PlatformView

exports.PlatformView = BasePlatformView.extend({
  
  doBindings : function(){
    BasePlatformView.prototype.doBindings.call(this)
    History.loadHistory()
    
    BABB.EventEmitter.on('control-down', function(){
      var historyContainer = $('#history-container')[0]
      if(historyContainer){
        historyContainer.scrollByLines(1)
      }
    }, this)
    BABB.EventEmitter.on('control-up', function(){
      var historyContainer = $('#history-container')[0]
      if(historyContainer){
        historyContainer.scrollByLines(-1)
      }
    }, this)
    BABB.EventEmitter.on('control-next', function(){
      var historyContainer = $('#history-container')[0]
      if(historyContainer){
        historyContainer.scrollByLines(-historyContainer.scrollHeight)
      }
    }, this)
    BABB.EventEmitter.on('control-previous', function(){
      var historyContainer = $('#history-container')[0]
      if(historyContainer){
        historyContainer.scrollByLines(-historyContainer.scrollHeight)
      }
    }, this)
    
  },
  
  getCoverflowTemplatePath : function(){
    return __dirname+'/item-template.html'
  },
  
  updateTitle : function(){    
    if(this.focusedRom){
      var historyEntry = History.getJSONEntry(this.focusedRom.get('title'))      
      if(historyEntry.title && historyEntry.title !=''){
        $('#romTitle').html(historyEntry.title)
      }else{
        BasePlatformView.prototype.updateTitle.call(this)
      }
    }
  },
    
  updateStuff : function(){
    BasePlatformView.prototype.updateStuff.call(this)
    this.updateHistory()
  },
  
  updateHistory : function(){    
    if(this.focusedRom){     
      var historyEntry = History.getHtmlEntry(this.focusedRom.get('title'))
      $('#history-container').html(historyEntry)
    }
  },
  
})
