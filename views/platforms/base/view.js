var BABB = global.BABB
var Fs = require('fs')
var Path = require('path')
var Uuid = BABB.coreRequire('uuid')
var KeysController = BABB.coreRequire('keysController')
var CoversProvider = BABB.coreRequire('coversProvider')
var LauncherMapper = BABB.coreRequire('launcherMapper')

exports.PlatformView = Backbone.View.extend({
  lastSelectedRomId : 0,

  recreateStuff : function(iRomsCollection){
    var self = this
    self.recreateGraphicalRomList(iRomsCollection)
    self.recreateStats()
  },

  updateStuff : function(){
    var self = this
    self.updateRomTitle()
    self.updateLauncherName()
    self.updateStats()
    self.updateCover()
    self.updateLogos()
  },

  initialize : function(){
    var self = this
    BABB.EventEmitter.on('requestControledViewChange',function(iView){
      if(iView != self){
        self.doUnbindings()
      }else{
        self.doBindings()
        BABB.EventEmitter.trigger('controledViewChanged', self)
        self.recreateStuff()
      }
    }, this)
  },

  doUnbindings : function(){
    BABB.EventEmitter.off(null, null, this)
  },

  doBindings : function(){
    var self = this

    BABB.EventEmitter.on('romsCollectionChanged', function(iRomsCollection){
      self.addIllustrationProvider(iRomsCollection)
      self.recreateStuff(iRomsCollection)
    }, this)

    BABB.EventEmitter.on('control-valid', function(){
      BABB.EventEmitter.trigger('romValidated', self.focusedRom)
    }, this)

    BABB.EventEmitter.on('control-next',function(){
      self.coverflowView.Next()
      if(KeysController.isSpeedDown){
        for(var i = 0; i<9; i++){
          self.coverflowView.Next()
        }
      }
    }, this)

    BABB.EventEmitter.on('control-previous', function(){
      self.coverflowView.Previous()
      if(KeysController.isSpeedDown){
        for(var i = 0; i<9; i++){
          self.coverflowView.Previous()
        }
      }
    }, this)

    BABB.EventEmitter.on('control-change-launcher', function(){
      var platform = self.getPlatform(self.focusedRom)
      var newLauncher = platform.getNextLauncher(self.focusedRom)
      LauncherMapper.mapLauncher(self.focusedRom, platform, newLauncher)
      self.updateLauncherName()
    }, this)

    BABB.EventEmitter.on('control-right', function(){
      var covers = CoversProvider.provideCovers(self.focusedRom, self.getPlatform(self.focusedRom))
      var nbCovers = covers.length
      if(nbCovers>1){
        var lastGeneratedName
        for(var i=0; i< nbCovers; i++){
          lastGeneratedName = Path.dirname(covers[i])+Path.sep+((i+1)%nbCovers)+Uuid.v1()+Path.extname(covers[i])
          Fs.renameSync(covers[i], lastGeneratedName)
        }
        self.updateCover(self.focusedRom, Path.resolve(lastGeneratedName))
      }
    }, this)

    BABB.EventEmitter.on('control-left', function(){
      var covers = CoversProvider.provideCovers(self.focusedRom, self.getPlatform(self.focusedRom))
      var nbCovers = covers.length
      if(nbCovers>1){
        var firstGeneratedName
        var lastGeneratedName
        for(var i=0; i< nbCovers; i++){
          lastGeneratedName = Path.dirname(covers[i])+Path.sep+((i+nbCovers-1)%nbCovers)+Uuid.v1()+Path.extname(covers[i])
          Fs.renameSync(covers[i], lastGeneratedName)
          if(i==1){
            firstGeneratedName = lastGeneratedName
          }
        }
        self.updateCover(self.focusedRom, Path.resolve(firstGeneratedName))
      }
    }, this)

    BABB.EventEmitter.on('romFocused', function(iRom){
      self.focusedRom = iRom
      self.updateStuff()
    }, this)

    BABB.EventEmitter.on('afterRun', function(iRom, iPlatform){
      self.updateStuff()
    }, this)
  },

  getPlatform : function(iRom){
    return this.associatedPlatform
  },

  getHtmlCoverElement : function(iRom){
    throw 'must be overriden'
  },

  getNoCoverPath : function(){
    return Path.join(__dirname, '..','shared','no_cover.png')
  },

  updateCover : function(iRom, iResolvedCoverPath){
    var self = this
    if(iRom && iResolvedCoverPath){

      console.log('before updating '+iRom+' with '+iResolvedCoverPath)
      if(!iResolvedCoverPath) return
      process.nextTick(function(){
        var htmlCoverElement = self.getHtmlCoverElement(iRom)
        console.log('updating '+htmlCoverElement)
        if(htmlCoverElement){
          htmlCoverElement.css("background-image", "url('"+encodeURI(iResolvedCoverPath)+"')")
        }
      })

    }else if(iRom && typeof(iResolvedCoverPath) == 'undefined'){

      if(iRom.getIllustrationPath){
        self.updateCover(iRom, iRom.getIllustrationPath())
      }

    }else if(typeof(iRom) == 'undefined' && typeof(iResolvedCoverPath) == 'undefined'){

      if(self.focusedRom && self.focusedRom.getIllustrationPath){
        self.updateCover(self.focusedRom, self.focusedRom.getIllustrationPath())
      }

    }
  },

  addIllustrationProvider : function(iRomsCollection){
    var self = this
    var getFirstResolvedPath = function(iPaths){
      if(!iPaths) return Path.resolve(self.getNoCoverPath())
      var illustrationPath = iPaths[0]
      if(Fs.existsSync(illustrationPath)){
        return Path.resolve(illustrationPath)
      }
      return Path.resolve(self.getNoCoverPath())
    }

    for(var i = 0; i<iRomsCollection.size(); i++){
      var currentRom = iRomsCollection.at(i)
      currentRom.getIllustrationPath = (
      function(iRom, iPlatform){
        return function(){
          var illustrationPathes = CoversProvider.provideCovers(iRom, iPlatform, function(err, iPaths){
            console.log('callback provideCovers: err='+err+' iPaths='+iPaths)
            if(err){
              console.log(err)
              return
            }
            var illustrationPath = getFirstResolvedPath(iPaths)
            console.log('before call updateCover, illustrationPath='+illustrationPath)
            self.updateCover(iRom, illustrationPath)
          })

          return getFirstResolvedPath(illustrationPathes)
        }
      })(currentRom, this.getPlatform(currentRom))
    }
  },

  updateRomTitle : function(){
    if(this.focusedRom){
      $('#romTitle').html(this.focusedRom.get('title'))
    }
  },

  updateLauncherName : function(){
    if(this.focusedRom){
      var launcher = this.getPlatform(this.focusedRom).getLauncher(this.focusedRom)
      $('#launcherName').html('<i>Launched by:</i><br/><b>'+launcher.get('name')+'</b>')
    }
  },

  updateStats : function(){
    if(this.focusedRom && this.getPlatform(this.focusedRom) && this.statsView){
      this.statsView.forceUpdate(this.focusedRom, this.getPlatform(this.focusedRom))
    }
  },

  updateLogos : function(){
    var logoPlatformElement = $('#logoPlatform')
    if(logoPlatformElement){
      logoPlatformElement.css("background-image", "url('"+encodeURI(this.getPlatform(this.focusedRom).getLogoPath())+"')")
    }
  },

  recreateStats : function(){
    var StatsView = BABB.coreRequire('stats').StatsView
    this.statsView = new StatsView({el:'#stats'})
  },

  recreateGraphicalRomList : function(iRomsCollection){
    throw 'must be overriden'
  }

})
