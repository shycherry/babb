var Config = global.BABB.CoversProviderConfig
var Fs = require('fs')
var Path = require('path')
var ChildProcess = require('child_process')
var EventEmitter = global.BABB.EventEmitter
var URI = global.BABB.coreRequire('uri')
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

  try{
    var coversRootPath = Config.coversRootPath
    if(iRom && iPlatform){
      coversRootPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
      coversRootPath = coversRootPath.replace('\'', ' ').replace('"',' ') //fix the buggy url when injecting in template
    }
    
    var existingCoversPaths = searchLocalCovers(coversRootPath)
    
    if(!existingCoversPaths || existingCoversPaths.length <= 0){
      searchGoogleAndDownload(iRom.get('title')+' '+iPlatform.get('name'), coversRootPath, iCallback)
      return []
    }else{
      return existingCoversPaths
    }
  }catch(exception){
    return []
  }  
}

var searchLocalCovers = function(iCoversRootPath){
  var result = []
  if(Fs.existsSync(iCoversRootPath)){    
    var filesInRoot = Fs.readdirSync(iCoversRootPath)
    
    for(iFile in filesInRoot){
      var currentFileName = filesInRoot[iFile]
      var currentExtFileName = Path.extname(currentFileName)
      if(['.jpg', '.png', '.bmp', '.gif', '.jpeg'].indexOf(currentExtFileName.toLowerCase()) != -1){
        result.push(iCoversRootPath+Path.sep+currentFileName)
      }
    }
  }
  return result
}

var searchGoogleAndDownload = function(iSearchExpression, iCoversRootPath, iCallback){
  preparePath(iCoversRootPath)  
  searchGoogleAPI(iSearchExpression, 
  (function(iCoversRootPath){
    return function(iSearchResults){
      if(iSearchResults && iSearchResults.items){
        var imagesEntries = iSearchResults.items
        var nbImagesToRetrive = Math.min(Config.maxSearchResults, imagesEntries.length)
        for(i=0;i<nbImagesToRetrive;i++){
          var imageURL = new URI(imagesEntries[i].link)
          var imageName = imageURL.path()
          var localPath = iCoversRootPath+Path.sep+'cover'+i+Path.extname(imageName)
          downloadImage(imageURL.toString(), localPath, iCallback)
        }
      }
    }
  })(iCoversRootPath))
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
                if(iCallback) iCallback()
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