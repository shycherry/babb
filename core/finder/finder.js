var $ = global.$
var Backbone = global.Backbone
var _ = global._
var BABB = global.BABB

var fs = require('fs')
var path = require('path')

var stop = false
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

exports.find = function(start, searchedFilename, onFindCallback, onNotFindCallback){
  stop = false
  deepCounter = 0
  walk(start, function(e, dirPath, dirs, files){
    deepCounter --
    if(files && files.indexOf(searchedFilename) != -1){
      stop = true
      onFindCallback(path.normalize(path.join(dirPath, searchedFilename)))
    }else if(deepCounter <= 0 && !stop){
      onNotFindCallback()
    }
  })
}

function walk(start, callback) {
  if(stop){
    return
  }
  deepCounter++

  fs.lstat(start, function (err, stat) {
    if (err) { return callback(err) }

    if (stat.isDirectory()) {
      fs.readdir(start, function (err, files) {
        if(files){
          var coll = files.reduce(function (acc, i) {
            var abspath = path.join(start, i)

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

          return callback(null, start, coll.dirs, coll.names)
        }
      })
    } else {
      return callback(new Error("path: " + start + " is not a directory"))
    }

  })
}
