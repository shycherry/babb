var Fs = require('fs')
var historyStream = null
var indexMap = {}
var historyTemplate = _.template(Fs.readFileSync(__dirname+'/history-template.html').toString())

var getHtmlEntry = function(romName){
  var parsedEntry = parseRawEntry(getRawFullEntry(romName))  

  if(parsedEntry.title == ''){
    return historyTemplate({
      title:'No history',
      copyright:'',
      resumee:'',
      details:''
    })
  }else{
    return historyTemplate({
      title:parsedEntry.title, 
      copyright:parsedEntry.copyright,
      resumee:parsedEntry.resumee,
      details:parsedEntry.details     
    })
  }
    
}

var parseRawEntry = function(iRawFull){
  
  //skip header
  var cursor = iRawFull.indexOf('$bio')
  var toParse = iRawFull.substring(cursor+4).trim()
  
  //copyright & title
  var oCopyright = ''
  var oTitle = ''
  cursor = toParse.indexOf('(c)')
  if(-1 != cursor){
    oTitle = toParse.substring(0, cursor).trim()
    toParse = toParse.substring(cursor).trim()
    cursor = toParse.indexOf('\n')
    oCopyright = toParse.substring(0, cursor)
  }else{
    cursor = toParse.indexOf('\n')  
    oTitle = toParse.substring(0, cursor).trim()
  }
  
  //resumee & details
  var oDetails = ''
  var oresumee = ''  
  toParse = toParse.substring(cursor, toParse.indexOf('$end')).trim()
  
  var detailsIndex = toParse.indexOf('- ')
  if(-1 == detailsIndex){
    oresumee = toParse
  }else if (detailsIndex > 0){
    oresumee = toParse.substring(0, detailsIndex).trim()
    oDetails = toParse.substring(detailsIndex).trim()
  }else{
    oDetails = toParse.substring(detailsIndex).trim()
  }  
  
  return {
    title: oTitle, 
    copyright: oCopyright, 
    resumee: oresumee, 
    details : oDetails
  }
}

var getRawBioEntry = function(romName){
  var rawEntry = getRawFullEntry(romName)
  var bioIndex = rawEntry.indexOf('$bio')
  
  if(bioIndex >= 0){
    return rawEntry.substring(bioIndex+4, rawEntry.length-4)
  }else{
    return ''
  }
}

var getRawFullEntry = function(romName){  
  var romNameIndex = indexMap[romName];
  
  if(!romNameIndex){
    return ''
  }
    
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
    console.log('building history index...')
    
    var regExp = /[$]info=.*,/mg //$info=game1,game2,...,
    var indexEntries
    while ((indexEntries = regExp.exec(historyStream)) !== null){
      var indexEntry = indexEntries[0]
      indexEntry = indexEntry.substring(indexEntry.indexOf('=')+1)
      var entries = indexEntry.split(',')
      for(var entryIndex in entries){
        var entry = entries[entryIndex]
        if(entry != ''){
          indexMap[entry] = regExp.lastIndex
        }
      }
    }
    console.log('history index... done !'+indexEntries)
  }else{
    console.log('history already loaded, skipping...')
  }
}

exports.getHtmlEntry = getHtmlEntry
exports.getRawBioEntry = getRawBioEntry
exports.getRawFullEntry = getRawFullEntry
exports.loadHistory = loadHistory