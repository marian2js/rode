/**
 * Module dependencies
 */
var fs = require('extfs'),
	path = require('path'),
	http = require('http'),
	cache = require('nodecache');

var rode = {
	express: require('express')
};
var config = null;
var coreConfig = null;
var baseDir = null;
rode.app = rode.express();

rode.start = function (dirname, cb) {
	baseDir = dirname;
	if (!rode.config) {
		rode.getConfig();
	}
	createRoutes(function () {
		cb(null);
	});
};

rode.startServer = function (cb) {
	http.createServer(rode.app).listen(rode.app.get('port'), cb);
};

/**
 *
 * @returns {String}
 */
rode.getRootDir = function () {
	return path.normalize(baseDir + '/')
};

rode.getCoreDir = function () {
	return path.normalize(__dirname + '/');
};

/**
 *
 * @param [env]
 * @returns {Object}
 */
rode.getConfig = function (env) {
	if (!config) {
		configger(require(rode.getRootDir() + 'config/config')(env));
	}
	return config;
};

/**
 *
 * @param [env]
 * @returns {Object}
 */
rode.getCoreConfig = function (env) {
	if (!coreConfig) {
		coreConfig = require(rode.getCoreDir() + 'config/config')(env);
	}
	return coreConfig;
};

/**
 *
 * @param pack
 * @param [ctrl]
 * @returns {Controller}
 */
rode.getController = function (pack, ctrl) {
	if (!ctrl) {
		ctrl = 'Main';
	}
	return require(rode.getPackagesPath(pack) + '/Controller/' + ctrl + 'Controller');
};

rode.getCoreController = function (pack, ctrl) {
	if (!ctrl) {
		ctrl = 'Main';
	}
	return require(rode.getCorePackagesPath(pack) + '/Controller/' + ctrl + 'Controller');
};

rode.getModel = function (pack, model) {
	if (!model) {
		model = pack
	}
	return require(rode.getPackagesPath(pack) + '/Model/' + model);
};

rode.getCoreModel = function (pack, model) {
	if (!model) {
		model = pack;
	}
	return require(rode.getCorePackagesPath(pack) + '/Model/' + model);
};

rode.getCoreComponent = function (type, name) {
	return require(rode.getCorePackagesPath('Component') + '/' + type + '/' + name);
};

rode.getBaseModel = function () {
	return rode.getCoreModel('Abstract', 'Model');
};

rode.getDb = function () {
	var mongo = rode.getCoreComponent('DB', 'Mongo');
	return mongo.getDb();
};

rode.getRouter = function (pack) {
	var routerCtrl = rode.getCoreController('Router');
	return routerCtrl(pack);
};

/**
 * The callback get array of packages
 * {Asynchronous}
 * @api public
 */
rode.getPackages = function (cb) {
	var packs = cache.get('rode_packages');
	if (packs) {
		return cb(null, packs);
	}
	var path = rode.getConfig().srcDir;
	fs.getDirs(path, function (err, files) {
		if (err) {
			return cb(err);
		}
		cache.set('rode_packages', files);
		cb(null, files);
	});
};

rode.getCorePackages = function (cb) {
	var path = rode.getCoreConfig().srcDir;
	fs.getDirs(path, function (err, files) {
		if (err) {
			return cb(err);
		}
		cb(null, files);
	});
};

rode.getPackagesSync = function () {
	var packs = cache.get('rode_packages');
	if (!packs) {
		var srcPath = rode.getConfig().srcDir;
		packs = fs.readdirSync(srcPath);
		cache.set('rode_packages', packs);
	}
	return packs;
};

rode.getPackagesPath = function (pack) {
	return rode.getConfig().srcDir + '/' + pack;
};

rode.getCorePackagesPath = function (pack) {
	return rode.getCoreConfig().srcDir + '/' + pack;
};

var configger = function (conf) {
	config = conf;

	// Config Port
	rode.app.set('port', config.port || 3000);

	// Config Views
	if (config.views) {
		rode.app.set('views', config.views.dir || '');
		rode.app.set('view engine', config.views.engine || 'jade');
	}

	// Config Favicon
	if (config.favicon) {
		rode.app.use(config.favicon);
	}

	// Config Logger
	if (config.logger) {
		rode.app.use(config.logger);
	}

	// Config Statics
	if (config.staticsDir) {
		rode.app.use(rode.express.static(config.staticsDir));
	}
	else {
		throw new Error('Please add option "staticsDir" to config');
	}

	// Config Error Handler
	if (config.useErrorHandler) {
		rode.app.use(rode.express.errorHandler());
	}

	// Config BodyParser
	if (config.bodyParser) {
		rode.app.use(rode.express.bodyParser());
	}

	// Config CSS
	switch (config.css) {
		case 'less':
			rode.app.use(require('less-middleware')({ src: config.staticsDir }));
			break;
		case 'stylus':
			rode.app.use(require('stylus').middleware(config.staticsDir));
	}

	// Config MongoDB
	if (config.mongo && config.mongo.autoconnect) {
		rode.getDb();
	}
};

var createRoutes = function (cb) {
	rode.getPackages(function (err, packs) {
		if (err) {
			return cb(err);
		}
		packs.forEach(function (pack) {
			var packRouter = rode.getRouter(pack);
			var routePath = path.join(rode.getPackagesPath(pack), 'routes.js');
			try {
				require(routePath);
				packRouter.forEach(function (route) {
					var routePath = packRouter.getPath(route.action);
					var controller = rode.getController(pack, route.controller);
					var call = controller[route.action];
					if (route.method === 'get') {
						rode.app.get(routePath, call);
					}
					else if (route.method === 'post') {
						rode.app.post(routePath, call);
					}
					else {
						route.app.all(routePath, call);
					}
				});
			}
			catch (e) { }
		});
		cb(null);
	});
};

module.exports = rode;