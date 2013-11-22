var _path = require('path'),
	mkdirp = require('mkdirp'),
	S = require('string'),
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
	 * Write templates when generate app or package
	 *
	 * @param path
	 * @param engine
	 * @param [data]
	 */
	self.writeViews = function (path, engine, data) {
		self.mkdir(path, function() {
			var viewsPath = __dirname + '/files/views/';
			var index;

			if (!data) {
				data = {
					path: '',
					pack: ''
				};
			}
			switch (engine) {
				case 'ejs':
					self.write(_path.normalize(path + '/index.ejs'), renderViews(viewsPath + 'index.ejs', data));
					self.write(_path.normalize(path + '/layout.ejs'), renderViews(viewsPath + 'layout.ejs', data));
					break;
				case 'jade':
					self.write(_path.normalize(path + '/layout.jade'), renderViews(viewsPath + 'layout.jade', data));
					self.write(_path.normalize(path + '/index.jade'), renderViews(viewsPath + 'index.jade', data));
					break;
				case 'jshtml':
					throw new Error('jshtml not supported yet!');
					break;
				case 'hjs':
					self.write(_path.normalize(path + '/index.hjs'), renderViews(viewsPath + 'index.hjs', data));
					break;
				case 'soy':
					self.write(_path.normalize(path + '/index.soy'), renderViews(viewsPath + 'index.soy', data));
					break;
			}
		});
	};

	/**
	 *
	 * @param path
	 * @param data
	 * @returns {string}
	 */
	var renderViews = function (path, data) {
		return S(fs.readFileSync(path).toString())
			.replaceAll('{{path}}', data.path)
			.replaceAll('{{pack.}}', data.pack ? data.pack + '.' : '');
	};

	/**
	 * Write Sources
	 *
	 * @param path
	 * @param pack
	 * @param src
	 */
	self.writeSources = function (path, pack, src) {
		var srcPath = _path.normalize(path + '/' + pack);
		var testPath = srcPath + '/Tests';
		utils.mkdir(srcPath, function () {
			utils.mkdir(srcPath + '/Controller', function () {
				utils.write(srcPath + '/Controller/MainController.js', src.Controller.MainController);
			});
			utils.mkdir(srcPath + '/Model', function () {
				utils.write(srcPath + '/Model/' + pack + '.js', src.Model.Main);
			});
			utils.mkdir(testPath, function () {
				utils.mkdir(testPath + '/Controller', function () {
					utils.write(testPath + '/Controller/MainControllerTest.js', src.Tests.Controller.MainControllerTest);
				});
				utils.mkdir(testPath + '/Model', function () {
					utils.write(testPath + '/Model/' + pack + 'Test.js', src.Tests.Model.MainTest);
				});
			});
			utils.write(srcPath + '/routes.js', src.routes);
		});
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