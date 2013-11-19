var _path = require('path'),
	mkdirp = require('mkdirp'),
	fs = require('extfs');

var utils = (function () {
	var self = {};

	/**
	 * Extract the path from an array
	 *
	 * @param array
	 * @returns {string} path
	 */
	self.extractPath = function (array) {
		var count = array.length;
		for (var i = 0; i < count; i++) {
			if (array[i][0] === '/') {
				return array.splice(i, 1)[0];
			}
		}
		return null;
	};

	/**
	 * Find root path for app
	 *
	 * @param [path]
	 * @returns {string} path
	 */
	self.findRootPath = function (path) {
		if (!path) {
			path = __dirname;
		}
		var err = false;
		while (path !== '/') {
			path = _path.resolve(path);
			if (self.isRootPath(path)) {
				return path;
			}
			path = _path.join(path, '../');
		}
		return null;
	};

	/**
	 * Check if path is the root path of the app
	 *
	 * @param path
	 * @returns {boolean}
	 */
	self.isRootPath = function (path) {
		var files = fs.readdirSync(path);
		return files.indexOf('package.json') !== -1 && files.indexOf('config') !== -1;
	};

	/**
	 * Set error when no installation is detected
	 *
	 * @param path
	 */
	self.errorNotRode = function (path) {
		self.abort('Can not find a Rode installation in ' + _path.resolve(path));
	};

	/**
	 * Based on Express.
	 * Original Source: https://github.com/visionmedia/express/blob/master/bin/express
	 * License: https://github.com/visionmedia/express/blob/master/LICENSE
	 *
	 * echo str > path.
	 *
	 * @param {string} path
	 * @param {string} str
	 */
	self.write = function (path, str) {
		fs.writeFile(path, str);
		console.log('   \x1b[36mcreate\x1b[0m : ' + path);
	};

	/**
	 * Based on Express.
	 * Original Source: https://github.com/visionmedia/express/blob/master/bin/express
	 * License: https://github.com/visionmedia/express/blob/master/LICENSE
	 *
	 * Mkdir -p.
	 *
	 * @param {string} path
	 * @param {Function} [fn]
	 */
	self.mkdir = function (path, fn) {
		mkdirp(path, 0755, function(err){
			if (err) throw err;
			console.log('   \033[36mcreate\033[0m : ' + path);
			fn && fn();
		});
	};

	/**
	 * Based on Express.
	 * Original Source: https://github.com/visionmedia/express/blob/master/bin/express
	 * License: https://github.com/visionmedia/express/blob/master/LICENSE
	 *
	 * Exit with the given `str`.
	 *
	 * @param {string} [str]
	 */
	self.abort = function (str) {
		console.error(str || '');
		process.exit(1);
	};

	return self;
})();

module.exports = utils;