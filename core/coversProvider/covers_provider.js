var Config = global.BABB.CoversProviderConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var EventEmitter = global.BABB.EventEmitter
var Http = require('http')
var $ = global.$

var searchGoogleAPI = function(iSearchExpression, iCallback){
  var encodedQuery = encodeURI(iSearchExpression)
  var searchURI  = 'https://www.googleapis.com/customsearch/v1?key='+Config.googleAPIKey+'&cx='+Config.googleCustomSearchId+'&imgSize=medium&searchType=image&q='+encodedQuery
  
  $.get(searchURI, function(data){
    if(iCallback){
      iCallback(data)
    }
  })  
}

var provideCovers = function(iRom, iPlatform, iCallback){

  var coversPath = Config.coversPath
  if(iRom && iPlatform){
    coversPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
  }
  preparePath(coversPath)
  
  searchGoogleAPI(iRom.get('title')+' '+iPlatform.get('name'), 
  (function(iCoversPath){
    return function(iSearchResults){
      if(iSearchResults && iSearchResults.items){
        var imagesEntries = iSearchResults.items
        var nbImagesToRetrive = Math.min(Config.maxSearchResults, imagesEntries.length)
        for(i=0;i<nbImagesToRetrive;i++){
          var imageURL = imagesEntries[i].link        
          var localPath = coversPath+Path.sep+'cover'+i+Path.extname(imageURL)
          downloadImage(imageURL, localPath, iCallback)
        }
      }
    }
  })(coversPath))
  
}

var downloadImage = function(iURL, iLocalPath, iCallback){
  if(iURL && iLocalPath){
  
    (function(iURL, iLocalPath){
    
      var request = Http.get(iURL, function(res){
        var imagedata = ''
        res.setEncoding('binary')

        res.on('data', function(chunk){
            imagedata += chunk
        })

        res.on('end', function(){
            Fs.writeFile(iLocalPath, imagedata, 'binary', function(err){
                if (err) throw err
                iCallback()
            })
        })
      })
    
    })(iURL, iLocalPath)
    
  }
}

var preparePath = function(iPath){
  if( ! Fs.existsSync(Config.coversPath)){
    Fs.mkdirSync(Config.coversPath)
  }
  if( ! Fs.existsSync(iPath)){
    Fs.mkdirSync(iPath)
  }
  
}

exports.provideCovers = provideCovers
exports.downloadImage = downloadImage
exports.searchGoogleAPI = searchGoogleAPI