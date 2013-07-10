var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var Path = require('path')
var Fs = require('fs')

var Launcher = Backbone.Model.extend({
  defaults: {
    id : "x",
    name : "unammed launcher",
    path : "/default/path"
  },

  _launcherConfig : null,

  initialize: function(){
    this.set('id', this.cid)

    if(this.getLauncherConfig().name){
      this.set('name', this.getLauncherConfig().name)
    }
  },

  getLauncherConfig : function(){
    if(!this._launcherConfig){
      var configPath = Path.normalize(this.get('path')+'/config')
      if(Fs.existsSync(configPath)){
        this._launcherConfig = require(configPath).LauncherConfig
      }else{
        this._launcherConfig = {}
      }
    }
    return this._launcherConfig
  },

  getLogoPath : function(){
    if(this.getLauncherConfig().logoPath){
      return this.getLauncherConfig().logoPath
    }else{
      return this.get('path')+Path.sep+'logo.png'
    }
  },

  getShadowConfig: function(){
    if(this.getLauncherConfig().ShadowConfig){
      return this.getLauncherConfig().ShadowConfig
    }
    return null
  },

  runRom : function (iPlatform, iRom){
    console.log('using default runRom')
    if(iRom){
      var emulatorPath = this.getLauncherConfig().emulatorPath
      var selectedRomPath = iRom.get('path')
      if(selectedRomPath){
        var Spawner = global.BABB.Utils.Spawner
        var Path = require('path')
        Spawner.spawn(
          emulatorPath,
          [selectedRomPath],
          {cwd : Path.dirname(emulatorPath)},
          iPlatform,
          iRom
        )
      }
    }
  },

  isAvailable : function (){
    var emulatorPath = this.getLauncherConfig().emulatorPath
    return Fs.existsSync(emulatorPath)
  },

  toString: function(){
    return this.get('name')+' ('+this.get('path')+')'
  }
})

var LaunchersCollection = Backbone.Collection.extend({
  model: Launcher,
  initialize: function(){
  }
})

exports.Launcher = Launcher
exports.LaunchersCollection = LaunchersCollection
