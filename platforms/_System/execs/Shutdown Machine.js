exports.run = function(){
  var Path = require('path')
  BABB.coreRequire('spawner').spawn(__dirname+Path.sep+'shutdown.bat')
}
