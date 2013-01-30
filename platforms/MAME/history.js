var Fs = require('fs')
var historyStream = null

var getBioEntry = function(romName){
  var rawEntry = getRawEntry(romName)
  var bioIndex = rawEntry.indexOf('$bio')
  
  if(bioIndex >= 0){
    return rawEntry.substring(bioIndex+4, rawEntry.length-4)
  }else{
    return 'no bio'
  }
}

var getRawEntry = function(romName){  
  var romNameIndex = historyStream.search(romName);
    
  //rewind to the '$' of '$info'
  var entryStartIndex = romNameIndex
  while(historyStream.charAt(entryStartIndex)!='$' && entryStartIndex >= 0){
    entryStartIndex --
  }
  
  var entryEndIndex = historyStream.indexOf('$end',entryStartIndex)+4
  if(entryEndIndex >= 0){
    return historyStream.substring(entryStartIndex, entryEndIndex)
  }else{
    return ''
  }
}

var loadHistory = function(){
  if(!historyStream){
    console.log('will read history...')
    historyStream = Fs.readFileSync(__dirname+'/history.dat').toString()
    console.log('history...read !')
    //console.log('history : '+historyStream)
  }else{
    console.log('history already loaded, skipping...')
  }
}


exports.getBioEntry = getBioEntry
exports.loadHistory = loadHistory