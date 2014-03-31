// NOTE: This is the only file that does not support ES6 //

var traceur = require('traceur');
var path = require('path');
require('es6-shim');
require('es6-module-loader');
require('prfun');

// base path
global.__rodeBase = __dirname;

// ES6 files
traceur.require.makeDefault(function(filename) {
  // all the files outside the node_modules directory will use ES6
  return filename.startsWith(__dirname) && !filename.startsWith(path.join(__dirname, 'node_modules'));
});

// export rode.js
module.exports = require('./loader').rode;