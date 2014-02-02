/**
 * Module dependencies
 */
var _path = require('path'),
	http = require('http'),
	url = require('url'),
	express = require('express');

var rode = (function () {
	var self = {};
	var binCommand = false;
	var config;
	var coreConfig;
	var rootPath;
	var started = false;

	self.express = express;
	self.app = self.express();

	/**
	 * Start Rode App
	 *
	 * @param {string} path
	 * @param {Function} cb
	 */
	self.start = function (path, cb) {
		rootPath = path;
		if (!coreConfig) {
			self.getCoreConfig();
		}
		if (!config) {
			self.getConfig();
		}
		started = true;
		cb(null);
	};

	/**
	 * Start HTTP Server
	 *
	 * @param {Function} cb
	 */
	self.startServer = function (cb) {
		createRoutes(function () {
			self.view.compile(function (err) {
				if (err) throw err;
				http.createServer(self.app).listen(self.app.get('port'), cb);
			});
		});
	};

	/**
	 * Get Root Path
	 *
	 * @param [dir]
	 * @returns {string}
	 */
	self.getRootPath = function (dir) {
		var path = rootPath;
		if (!path) {
			return null;
		}
		if (dir) {
			path = _path.join(path, dir);
		}
		return _path.normalize(path + '/');
	};

	/**
	 * Set Root Path
	 *
	 * @param {string} path
	 */
	self.setRootPath = function (path) {
		rootPath = path;
	};

	/**
	 *
	 * @returns {string}
	 */
	self.getCorePath = function () {
		return _path.normalize(__dirname + '/');
	};

	/**
	 * Get path from a name.
	 *
	 * @param {string} name
	 * @returns {string}
	 */
	self.getPath = function (name) {
		switch (name) {
			case 'root':
				return self.getRootPath();
				break;
			case 'src':
				return self.getRootPath(self.getConfig().srcDir);
				break;
			case 'views':
				return self.getRootPath(self.getConfig().views.dir);
				break;
			case 'statics':case 'public':
				return self.getRootPath(self.getConfig().statics.dir);
				break;
			case 'images':
				return _path.join(self.getPath('statics'), self.getConfig().statics.images);
				break;
			case 'js':case 'javascript':
				return _path.join(self.getPath('statics'), self.getConfig().statics.js);
				break;
			case 'css':case 'stylesheets':
				return _path.join(self.getPath('statics'), self.getConfig().statics.css);
				break;
			default:
				return '';
		}
	};

	/**
	 *
	 * @param  {string} [env]
	 * @returns {Object}
	 */
	self.getConfig = function (env) {
		if (!config) {
			configger(require(self.getRootPath() + 'config/config')(env));
		}
		return config;
	};

	/**
	 *
	 * @param {string} [env]
	 * @param {boolean} [force]
	 * @returns {Object}
	 */
	self.getCoreConfig = function (env, force) {
		if (!coreConfig) {
			coreConfig = require(self.getCorePath() + 'config/config')(env);

			// Config Packages as soon as we have CoreConfig
			self.packages = require(self.getCoreConfig().srcDir + '/Component/Core/Packages');
		}
		if (force) {
			configger(coreConfig);
			self.getDb();
		}
		return coreConfig;
	};

	/**
	 *
	 * @param {string} pack
	 * @param {string} [ctrl]
	 * @returns {Controller}
	 */
	self.getController = function (pack, ctrl) {
		if (!ctrl) {
			ctrl = 'Main';
		}
		return require(self.packages.getPath(pack) + '/Controller/' + ctrl + 'Controller');
	};

	/**
	 *
	 * @param {string} pack
	 * @param {string} [ctrl]
	 * @returns {Controller}
	 */
	self.getCoreController = function (pack, ctrl) {
		if (!ctrl) {
			ctrl = 'Main';
		}
		return require(self.packages.getCorePath(pack) + '/Controller/' + ctrl + 'Controller');
	};

	/**
	 *
	 * @param {string} pack
	 * @param {string} [model]
	 * @returns {Model}
	 */
	self.getModel = function (pack, model) {
		if (!model) {
			model = pack
		}
		return require(self.packages.getPath(pack) + '/Model/' + model);
	};

	/**
	 *
	 * @param {string} pack
	 * @param {string} [model]
	 * @returns {Model}
	 */
	self.getCoreModel = function (pack, model) {
		if (!model) {
			model = pack;
		}
		return require(self.packages.getCorePath(pack) + '/Model/' + model);
	};

	/**
	 *
	 * @param {string} type
	 * @param {string} name
	 * @returns {Object}
	 */
	self.getCoreComponent = function (type, name) {
		return require(self.packages.getCorePath('Component') + '/' + type + '/' + name);
	};

	/**
	 *
	 * @returns {Model}
	 */
	self.getBaseModel = function () {
		return self.getCoreModel('Abstract', 'Model');
	};

	/**
	 *
	 * @param {string} pack
	 * @param {string} [name]
	 */
	self.getEntity = function (pack, name) {
		if (!name) {
			name = pack;
		}
		return require(self.packages.getPath(pack) + '/Entity/' + name);
	};

	/**
	 *
	 * @returns {Mongo}
	 */
	self.getDb = function () {
		if (binCommand) {
			return null;
		}
		var mongo = self.getCoreComponent('DB', 'Mongo');
		return mongo.getDb();
	};

	/**
	 *
	 * @param {string} pack
	 * @returns {Controller}
	 */
	self.getRouter = function (pack) {
		var routerCtrl = self.getCoreController('Router');
		return routerCtrl(pack);
	};

	/**
	 * Setter for BinCommand
	 *
	 * @param {boolean} bin
	 */
	self.setBinCommand = function (bin) {
		binCommand = bin;
	};

	/**
	 * Check if rode is started
	 *
	 * @returns {boolean}
	 */
	self.isStarted = function () {
		return started;
	};

	/**
	 * App Config
	 *
	 * @param conf
	 */
	var configger = function (conf) {
		config = conf;

		// Config Port
		self.app.set('port', config.port || 3000);

		// Config Host
		if (config.baseUri && !config.host) {
			config.host = url.parse(config.baseUri).host;
		}

		// Config Views
		self.view = self.getCoreController('Views');
		if (config.views) {
			self.view.configEngine();
		}

		// Config Favicon
		if (config.favicon) {
			self.app.use(config.favicon);
		}

		// Config Logger
		if (config.logger) {
			self.app.use(config.logger);
		}

		// Config CSS
		switch (config.css) {
			case 'less':
				self.app.use(require('less-middleware')(
					{
						src: self.getPath('statics'),
						compress: rode.env === 'production'
					}
				));
				break;
			case 'stylus':
				self.app.use(require('stylus').middleware(self.getPath('statics')));
		}

		// Config Statics
		if (config.statics && config.statics.dir) {
			self.app.use(self.express.static(self.getPath('statics')));
		}

		// Config Error Handler
		if (config.errorHandler) {
			self.app.use(self.express.errorHandler());
		}

		// Config BodyParser
		if (config.bodyParser) {
			self.app.use(self.express.bodyParser());
		}

		// Config MongoDB
		if (config.mongo && config.mongo.autoconnect) {
			self.getDb();
		}
	};

	/**
	 *
	 * @param {Function} cb
	 */
	var createRoutes = function (cb) {
		if (binCommand) {
			cb(null);
			return;
		}
		var Routing = self.getCoreController('Router', 'Routing');
		Routing(cb);
	};

	return self;
})();

module.exports = rode;