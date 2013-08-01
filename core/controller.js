var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Fs = require('fs')
var Path = require('path')
var Sniffer = BABB.coreRequire('sniffer')
var LauncherMapper = BABB.coreRequire('launcherMapper')
var ConfigShadow = BABB.coreRequire('configShadow')
var RomsCollectionView = BABB.coreRequire('roms').RomsCollectionView
var KeysView = BABB.coreRequire('keysController').KeysView

var Platform = BABB.coreRequire('platforms').Platform
var PlatformsCollection = BABB.coreRequire('platforms').PlatformsCollection
var RomsCollection = BABB.coreRequire('roms').RomsCollection


exports.FrontendView = Backbone.View.extend({

  platformsCollection : new PlatformsCollection(),
  romsCollection : new RomsCollection(),
  romsPathsToSniff : null,

  initialize : function(){
    this.keysView = new KeysView()
    $('#platformSelectionContainer').hide()
    $('#platformContainer').hide()
    //$('#bandana').hide()

    this.retrieveCfgMessagesView()
    this.retrieveCfgPlatformSelectionView()
    this.currentValidatedPlatform = null
    this.initBindings()
    this.sniffPlatforms()
    BABB.EventEmitter.trigger('requestControledViewChange', this.platformSelectionView)
  },

  sniffPlatforms : function(){
    this.platformsCollection.reset()
    delete this.platformsCollection.comparator
    var pathsToSniff = [BABB.GlobalConfig.defaultPlatformsPath]
    Sniffer.stopSniff(pathsToSniff)
    Sniffer.sniff(pathsToSniff, this.onPlatformsSniffed)
  },

  onPlatformsSniffed : function(iReport){
    if(iReport.isUpdate){
      this.sniffPlatforms()
    }else{
      for(var locSniffedPath in iReport){
        var locSniffedFilesArray = iReport[locSniffedPath]

        for(var i in locSniffedFilesArray){
          var locFileName = locSniffedFilesArray[i]
          var pathResolved = Path.join(locSniffedPath,locFileName)
          pathResolved = Path.resolve(pathResolved)
          var platformFile = require(pathResolved+Path.sep+'platform.js')

          if(platformFile && platformFile.Platform){
            var platform = new platformFile.Platform({path:pathResolved})
            if(platform){
              this.platformsCollection.add(platform)
            }
          }

        }

      }
    }
  },

  onPlatformsChanged : function(){
    BABB.EventEmitter.trigger('platformsCollectionChanged', this.platformsCollection)
  },

  sniffRoms : function(){    
    if(this.romsPathsToSniff){
      Sniffer.stopSniff(this.romsPathsToSniff)
    }
    this.romsCollection.reset()
    delete this.romsCollection.comparator
    var romsPathes = this.currentValidatedPlatform.getRomsPaths()
    
    if(typeof romsPathes == 'object'){      
      this.romsPathsToSniff = romsPathes
      Sniffer.sniff(romsPathes, this.onRomsSniffed)
    }else if(typeof romsPathes == 'string'){
      /* format : 'findFunctionName*fileToFindName(*..)'
         sample : 'findAll*snesroms.babbdir' */
      var parsedArray = romsPathes.split('*')
      switch(parsedArray[0]){
        case 'findAll':
          var Finder = BABB.coreRequire('finder')
          var finderRun = Finder.findAll(
            BABB.GlobalConfig.autoRomsFinderStartPath, 
            parsedArray[1],
            (function(iPlatform){
              return function(iRomsPathes){
                iPlatform.getPlatformConfig().romsPaths = iRomsPathes
                iPlatform.rewritePlatformConfig()
                BABB.EventEmitter.trigger('info', 'Roms found for '+iPlatform)
              }
            })(this.currentValidatedPlatform),
            (function(iPlatform){
              return function(){
                BABB.EventEmitter.trigger('info', 'Searched, but no roms found for '+iPlatform)
              }
            })(this.currentValidatedPlatform)
          )
          if(finderRun){
            BABB.EventEmitter.trigger('info', 'Start searching roms for '+this.currentValidatedPlatform)
          }else{
            BABB.EventEmitter.trigger('info', 'A search is already started, please wait...')
          }
        break        
      }      
    }    
  },

  onRomsSniffed : function(iReport){
    if(iReport.isUpdate){
      this.sniffRoms()
    }else{
      var romsProvider = this.currentValidatedPlatform.getRomsProvider()
      romsProvider(iReport, this.romsCollection)
    }
  },

  onRomsChanged : function(){
    BABB.EventEmitter.trigger('romsCollectionChanged', this.romsCollection)
  },

  retrieveCfgMessagesView : function(){
    var viewName = BABB.MessagesConfig.viewName
    var MessagesView = BABB.messagesViewsRequire(viewName).MessagesView
    this.messagesView = new MessagesView()
  },

  retrieveCfgPlatformSelectionView : function(){
    var viewName = BABB.PlatformSelectionConfig.viewName
    var PlatformSelectionView = BABB.platformSelectionViewsRequire(viewName).PlatformSelectionView
    this.platformSelectionView = new PlatformSelectionView()
  },

  initBindings : function(){
    _.bindAll(this, 'onPlatformsSniffed')
    _.bindAll(this, 'onPlatformsChanged')
    this.platformsCollection.on('change', this.onPlatformsChanged)
    this.platformsCollection.on('add', _.throttle(this.onPlatformsChanged,100))
    this.platformsCollection.on('remove', this.onPlatformsChanged)
    this.platformsCollection.on('reset', this.onPlatformsChanged)

    _.bindAll(this, 'onRomsSniffed')
    _.bindAll(this, 'onRomsChanged')
    this.romsCollection.on('change', this.onRomsChanged)
    this.romsCollection.on('add', _.throttle(this.onRomsChanged,100))
    this.romsCollection.on('remove', this.onRomsChanged)
    this.romsCollection.on('reset', this.onRomsChanged)

    var self = this

    BABB.EventEmitter.on('platformValidated', function(iPlatform){
      console.log('selection validated :'+iPlatform.get('name'))

      if( ! iPlatform){
        return
      }

      self.currentValidatedPlatform = iPlatform
      self.sniffRoms()
      BABB.EventEmitter.trigger('requestRenderPlatform', iPlatform)

    })

    BABB.EventEmitter.on('platformRendered', function(iPlatform){
      if(self.currentValidatedPlatform == iPlatform){
        var PlatformView = BABB.platformsViewsRequire(iPlatform.get('viewName')).PlatformView
        PlatformView = new PlatformView()
        PlatformView.associatedPlatform = iPlatform
        BABB.EventEmitter.trigger('requestControledViewChange', PlatformView)
      }
    })

    BABB.EventEmitter.on('romValidated', function(iRom){
      console.log('selecion validated :'+iRom.get('title'))

      if(!iRom){
        return
      }

      self.currentValidatedRom = iRom
      self.runRomIfp()
    })

    BABB.EventEmitter.on('control-back', function(){
      BABB.EventEmitter.trigger('requestControledViewChange', self.platformSelectionView)
    })

    BABB.EventEmitter.on('prepareRun', function(iRom, iPlatform){
      self.lockRun = true
      ConfigShadow.save(null, iPlatform)
      ConfigShadow.restore(iRom, iPlatform)
    })

    BABB.EventEmitter.on('afterRun', function(iRom, iPlatform){
      self.lockRun = false
      ConfigShadow.save(iRom, iPlatform)
      ConfigShadow.restore(null, iPlatform)
    })

  },

  runRomIfp : function(){

    if(this.currentValidatedPlatform && this.currentValidatedRom && ! this.lockRun){
      var currentLauncher =  this.currentValidatedPlatform.getLauncher(this.currentValidatedRom)
      if(currentLauncher && !currentLauncher.isAvailable()){
        BABB.EventEmitter.trigger('error', currentLauncher+' is not available')
      }else if(currentLauncher){
        currentLauncher.runRom(this.currentValidatedPlatform, this.currentValidatedRom)
      }
    }
  }

})
