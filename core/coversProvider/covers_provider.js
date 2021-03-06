﻿var Config = global.BABB.CoversProviderConfig
var Fs = require('fs')
var Path = require('path')
var EventEmitter = global.BABB.EventEmitter
var URI = require('URIjs')
var Https = require('https')
var Async = require('async')
var Http = require('http')
var $ = global.$

var searchGoogleAPI = function(iSearchExpression, iCallback){
  var encodedQuery = encodeURI(iSearchExpression)
  var searchURI  = 'https://www.googleapis.com/customsearch/v1?key='+Config.googleAPIKey+'&cx='+Config.googleCustomSearchId+'&imgSize=medium&searchType=image&q='+encodedQuery

  if(Config.enableGoogleSearchAPI){
    $.get(searchURI, function(data){
      if(iCallback) iCallback(null, data)
    }).fail(function(){
      if(iCallback) iCallback('failure on GET : '+searchURI, null)
    })
  }else{
    iCallback('googleSearchAPI disabled', null)
  }
}


var _searchGoogleAndDownloadWorker_ = function(iTask, iCallback){
  searchGoogleAndDownload(iTask.romTitle+' '+iTask.platformName, iTask.coversRootPath, iCallback)
}

var searchGoogleAndDownloadWorkerQueue = Async.queue(_searchGoogleAndDownloadWorker_, 1)
searchGoogleAndDownloadWorkerQueue.drain = function(){BABB.log('end calling google')}
searchGoogleAndDownloadWorkerQueue.saturated = function(){BABB.log('a remote call is pending... queueing !')}

var provideCovers = function(iRom, iPlatform, iCallback){

  var coversRootPath = Config.coversRootPath
  if(iRom && iPlatform){
    coversRootPath += Path.sep+iRom.get('title')+'_'+iPlatform.get('name')
    coversRootPath = coversRootPath.replace('\'', ' ').replace('"',' ') //fix the buggy url when injecting in template
  }

  var existingCoversPaths = searchLocalCovers(coversRootPath)

  if(!existingCoversPaths || existingCoversPaths.length <= 0){
    searchGoogleAndDownloadWorkerQueue.push({
      romTitle: iRom.get('title'),
      platformName: iPlatform.get('name'),
      coversRootPath: coversRootPath
    }, iCallback)
    return []
  }else{
    if(iCallback) iCallback(null, existingCoversPaths)
    return existingCoversPaths
  }

}

var searchLocalCovers = function(iCoversRootPath){
  var result = []
  if(Fs.existsSync(iCoversRootPath)){
    var filesInRoot = Fs.readdirSync(iCoversRootPath)

    for(var iFile in filesInRoot){
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
  (function(iCoversRootPath, iCallback){
    return function(err, iSearchResults){
      if(iSearchResults && iSearchResults.items){
        var imagesEntries = iSearchResults.items
        var nbImagesToRetrive = Math.min(Config.maxSearchResults, imagesEntries.length)
        var downloadArray = []
        for(i=0;i<nbImagesToRetrive;i++){
          var imageURL = new URI(imagesEntries[i].link)
          var imageName = imageURL.path()
          var imageExtension = Path.extname(imageName)
          if(!imageExtension || imageExtension === '')
            imageExtension = '.jpg'
          var localPath = iCoversRootPath+Path.sep+'cover'+i+imageExtension
          downloadArray.push({url: imageURL.toString(), localPath: localPath})
        }
        Async.each(downloadArray, downloadImageIterator, function(err){
          if(iCallback){
            if(err){
              iCallback(err, null)
            }else{
              iCallback(null, searchLocalCovers(iCoversRootPath))
            }
          }
        })
      }else{
        if(iCallback) iCallback(err, null)
      }
    }
  })(iCoversRootPath, iCallback))
}

var downloadImageIterator = function(iData, iCallback){
  return downloadImage(iData.url, iData.localPath, iCallback)
}

var downloadImage = function(iURL, iLocalPath, iCallback){
  if(iURL && iLocalPath){

    (function(iURL, iLocalPath){
      var getter = Http
      if(/https/.exec(iURL) !== null){
        getter = Https
      }
      var request = getter.get(iURL, function(res){
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
      }).on('error', function(err){
        BABB.log('error when downloading image from '+iURL)
        if(iCallback) iCallback()
      })

    })(iURL, iLocalPath)

  }
}

var preparePath = function(iPath){
  if( ! Fs.existsSync(Config.coversRootPath)){
    Fs.mkdirSync(Config.coversRootPath)
  }
  if( ! Fs.existsSync(iPath)){
    Fs.mkdirSync(iPath)
  }

}

exports.provideCovers = provideCovers
exports.downloadImage = downloadImage
exports.searchGoogleAPI = searchGoogleAPI
