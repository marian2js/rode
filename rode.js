/**
 * Module dependencies
 */
var _path = require('path'),
	http = require('http');

var rode = (function () {
	var self = {};
	var binCommand = false;
	var config;
	var coreConfig;
	var rootPath;
	var started = false;

	self.express = require('express');
	self.app = self.express();

	/**
	 * Start Rode App
	 *
	 * @param {string} path
	 * @param cb
	 */
	self.start = function (path, cb) {
		rootPath = path;
		if (!coreConfig) {
			self.getCoreConfig();
		}
		if (!config) {
			self.getConfig();
		}
		createRoutes(function () {
			cb(null);
			started = true;
		});
	};

	/**
	 * Start HTTP Server
	 *
	 * @param cb
	 */
	self.startServer = function (cb) {
		self.view.compile(function (err) {
			if (err) throw err;
			http.createServer(self.app).listen(self.app.get('port'), cb);
		});
	};

	/**
	 * Get Root Path
	 *
	 * @returns {string}
	 */
	self.getRootPath = function () {
		if (!rootPath) {
			return null;
		}
		return _path.normalize(rootPath + '/');
	};

	/**
	 * Set Root Path
	 *
	 * @param path
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
	 *
	 * @param [env]
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
	 * @param [env]
	 * @param [force]
	 * @returns {Object}
	 */
	self.getCoreConfig = function (env, force) {
		if (!coreConfig) {
			coreConfig = require(self.getCorePath() + 'config/config')(env);

			// Config Packages as soon as we have CoreConfig
			self.packages = require(self.getCoreConfig().srcDir + '/Component/Core/Packages');
		}
		if (force) {
			config = coreConfig;
			self.getDb();
		}
		return coreConfig;
	};

	/**
	 *
	 * @param pack
	 * @param [ctrl]
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
	 * @param pack
	 * @param [ctrl]
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
	 * @param pack
	 * @param [model]
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
	 * @param pack
	 * @param [model]
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
	 * @param type
	 * @param name
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
	 * @param pack
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
		if (config.baseUri) {
			config.host = config.baseUri.replace('http', '').replace('https', '').replace('://', '');
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

		// Config Statics
		if (config.staticsDir) {
			self.app.use(self.express.static(config.staticsDir));
		}
		else {
			throw new Error('Please add option "staticsDir" to config');
		}

		// Config Error Handler
		if (config.useErrorHandler) {
			self.app.use(self.express.errorHandler());
		}

		// Config BodyParser
		if (config.bodyParser) {
			self.app.use(self.express.bodyParser());
		}

		// Config CSS
		switch (config.css) {
			case 'less':
				self.app.use(require('less-middleware')({ src: config.staticsDir }));
				break;
			case 'stylus':
				self.app.use(require('stylus').middleware(config.staticsDir));
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
		self.packages.getAll(function (err, packs) {
			if (err) {
				cb(err);
				return;
			}
			packs.forEach(function (pack) {
				var packRouter = self.getRouter(pack);
				var routePath = _path.join(self.packages.getPath(pack), 'routes.js');
				try {
					require(routePath);
					packRouter.forEach(function (route) {
						var routePath = packRouter.getPath(route.action);
						var controller = self.getController(pack, route.controller);
						var call = controller[route.action];
						if (route.method === 'get') {
							self.app.get(routePath, call);
						}
						else if (route.method === 'post') {
							self.app.post(routePath, call);
						}
						else {
							self.app.all(routePath, call);
						}
					});
				}
				catch (e) { }
			});
			cb(null);
		});
	};

	return self;
})();

module.exports = rode;