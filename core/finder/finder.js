var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var fs = require('fs')
var path = require('path')

var stop = undefined
var deepCounter = 0

var idCpnt = 'finderCpnt'

exports.finderDialog = Backbone.View.extend({
  template : _.template( fs.readFileSync(__dirname+'/template.html').toString() ),

  initialize:function(){

    this.$el.append(this.template())
    this.$component = this.$el.find('#'+idCpnt)

    this.$el.on("click", ".rom", function(event){
      self.setSelected(self.itemsCollection.get(this.id))
      event.stopPropagation()
    })

    this.render()
  },

  render : function(){
    this.$component.remove()
    this.$el.append(this.template())
    this.$component = this.$el.find('#'+idCpnt)
  }
})

exports.findAll = function(startDir, searchedFilename, onFindCallback, onNotFindCallback){
  if(stop == false){
    console.log('finder is already running...')
    return false
  }
  stop = false
  deepCounter = 0
  dirPathes = []
  walk(startDir, function(e, dirPath, dirs, files){
    deepCounter --
    if(files && files.indexOf(searchedFilename) != -1){
      dirPathes.push(dirPath)
    }else if(deepCounter <= 0 && !stop){
      stop = true
      if(dirPathes.length){
        onFindCallback(dirPathes)  
      }else{
        onNotFindCallback()  
      }
    }
  })
  return true
}

exports.findFirst = function(startDir, searchedFilename, onFindCallback, onNotFindCallback){
  if(stop == false){
    console.log('finder is already running...')
    return false
  }
  stop = false
  deepCounter = 0
  walk(startDir, function(e, dirPath, dirs, files){
    deepCounter --
    if(files && files.indexOf(searchedFilename) != -1){
      stop = true
      onFindCallback(dirPath)
    }else if(deepCounter <= 0 && !stop){
      stop = true
      onNotFindCallback()
    }
  })
  return true
}

function walk(startDir, callback) {
  if(stop){
    return
  }
  deepCounter++

  fs.lstat(startDir, function (err, stat) {
    if (err) { return callback(err) }

    if (stat.isDirectory()) {
      fs.readdir(startDir, function (err, files) {
        if(files){
          var coll = files.reduce(function (acc, i) {
            var abspath = path.join(startDir, i)

            try{
              if (fs.statSync(abspath).isDirectory()) {
                walk(abspath, callback)
                acc.dirs.push(i)
              } else {
                acc.names.push(i)
              }
            }catch(err){
              console.log('error encountered while searching : '+err)
            }

            return acc
          }, {"names": [], "dirs": []})

          return callback(null, startDir, coll.dirs, coll.names)
        }
      })
    } else {
      return callback(new Error("path: " + startDir + " is not a directory"))
    }

  })
}
