var Fs = require('fs');

var watchers = {};

var pathsToSniff = null;
var callback = null;

var SniffedDirectoryRepport = function(){}

function sniff(parPathsToSniff, parCallback){
  pathsToSniff = parPathsToSniff;
  callback = parCallback;
  
  refillCollections();
  startSniff();
}

function notifyDirectoryChanged(report){
  if(callback){
    callback(report);
  }
}

function refillCollections(){
  
  pathsToSniff.forEach(function(pathToSniff){
    Fs.readdir(pathToSniff,function(err, files){      
      var locReport = new SniffedDirectoryRepport();
      locReport.sniffedPath = pathToSniff;
      var sniffedFilesArray = [];
      for(var i in files){
        sniffedFilesArray.push(files[i]);       
        //var rom = new Roms.Rom();
        //rom.set({id:rom.cid});
        //var filenameParts = Path.basename(files[i]).split('.');
        //rom.set({title:filenameParts[0]});
        //var pathNormalized = Path.join(pathToSniff,files[i]);
        //pathNormalized = Path.normalize(pathNormalized);
        //rom.set({path : pathNormalized});
        //sniffedFilesArray.add(rom);
      }
      locReport.sniffedFilesArray = sniffedFilesArray;      
      notifyDirectoryChanged(locReport);
    });
  });
}

function startSniff(){
  pathsToSniff.forEach(function(pathToSniff){
    var watcher = Fs.watch(pathToSniff, function(event, filename){
      console.log('event:'+event+' for filename:'+filename);
      refillCollections(pathsToSniff);
    });

    if(watcher){
      watchers[pathToSniff] = watcher;
    }
  });
}

function stopSniff(){
  //multiRomsCollectionView.unbind();
  pathsToSniff=null;
  
  for(var path in watchers){
    watchers[path].close();
    delete(watchers[path]);
  }
}

exports.sniff = sniff;
exports.stopSniff = stopSniff;