var _path = require('path'),
	os = require('os'),
	fs = require('extfs'),
	cache = require('nodecache'),
	S = require('string'),
	rode = require('../../../rode'),
	utils = require(rode.getCorePath() + 'bin/console-utils');

var packages = {

	/**
	 *
	 * @param pack
	 * @returns {string}
	 * @api public
	 */
	getPath: function (pack) {
		return _path.normalize(rode.getPath('src') + '/' + pack);
	},

	/**
	 *
	 * @param pack
	 * @returns {string}
	 * @api public
	 */
	getCorePath: function (pack) {
		return _path.normalize(rode.getCoreConfig().srcDir + '/' + pack);
	},

	/**
	 * The callback will be populated with array of packages
	 *
	 * @api public
	 */
	getAll: function (cb) {
		var packs = cache.get('rode_packages');
		if (packs) {
			return cb(null, packs);
		}
		var path = rode.getPath('src');
		fs.getDirs(path, function (err, files) {
			if (err) {
				return cb(err);
			}
			cache.set('rode_packages', files);
			cb(null, files);
		});
	},

	/**
	 *
	 * @returns {array}
	 * @api public
	 */
	getAllSync: function () {
		var packs = cache.get('rode_packages');
		if (!packs) {
			var srcPath = rode.getPath('src');
			packs = fs.getDirsSync(srcPath);
			cache.set('rode_packages', packs);
		}
		return packs;
	},

	/**
	 *
	 * @param cb
	 * @api public
	 */
	getAllCore: function (cb) {
		var path = rode.getCoreConfig().srcDir;
		fs.getDirs(path, function (err, files) {
			if (err) {
				return cb(err);
			}
			cb(null, files);
		});
	},

	/**
	 *
	 * @param name
	 * @param [rest]
	 * @param [force]
	 */
	add: function (name, rest, force) {
		name = S(name).capitalize();
		addPackage(name, !!rest, !!force);
	},

	remove: function (name) {

	}
};

function addPackage (pack, rest, force) {
	var filesPath = _path.normalize(rode.getCorePath() + 'bin/files/new-package/');
	var filesViewPath = _path.normalize(rode.getCorePath() + 'bin/files/views/');
	var destPath = _path.normalize(rode.getPath('src') + '/' + pack);
	var viewPath = _path.normalize(rode.getPath('views') + '/' + pack);

	// Check if path destPath not exists
	if (!force) {
		if (!fs.isEmptySync(destPath)) {
			throw new Error('Path not empty');
		}
	}

	var templates = {
		controller: fs.readFileSync(filesPath + 'Controller.js').toString(),
		model: fs.readFileSync(filesPath + 'Model.js').toString(),
		routes: fs.readFileSync(filesPath + 'routes.js').toString(),
		tests: {
			controller: fs.readFileSync(filesPath + 'Tests/ControllerTest.js').toString(),
			model: fs.readFileSync(filesPath + 'Tests/ModelTest.js').toString()
		}
	};
	var renderedTemplates = {
		controller: renderTemplate(pack, templates.controller),
		model: renderTemplate(pack, templates.model),
		routes: renderTemplate(pack, templates.routes, rest),
		tests: {
			controller: renderTemplate(pack, templates.tests.controller),
			model: renderTemplate(pack, templates.tests.model)
		}
	};
	if (rest) {
		templates.restController = fs.readFileSync(filesPath + 'RestController.js').toString();
		templates.tests.restController = fs.readFileSync(filesPath + 'Tests/RestControllerTest.js').toString();
		renderedTemplates.restController = renderTemplate(pack, templates.restController);
		renderedTemplates.tests.restController = renderTemplate(pack, templates.tests.restController);
	}

	// Create Controllers
	utils.mkdir(destPath + '/Controller', function () {
		utils.write(destPath + '/Controller/MainController.js', renderedTemplates.controller);
		utils.write(destPath + '/routes.js', renderedTemplates.routes);
		if (rest) {
			utils.write(destPath + '/Controller/RestController.js', renderedTemplates.restController);
		}
	});

	// Create Models
	utils.mkdir(destPath + '/Model', function () {
		utils.write(destPath + '/Model/' + pack + '.js', renderedTemplates.model);
	});

	// Create Views
	utils.writeViews(viewPath, rode.getConfig().views.engine, {
		path: '../',
		pack: pack
	});

	// Create Tests
	utils.mkdir(destPath + '/Tests/Controller', function () {
		utils.write(destPath + '/Tests/Controller/MainControllerTest.js', renderedTemplates.tests.controller);
		if (rest) {
			utils.write(destPath + '/Tests/Controller/RestControllerTest.js', renderedTemplates.tests.restController);
		}
	});
	utils.mkdir(destPath + '/Tests/Model', function () {
		utils.write(destPath + '/Tests/Model/' + pack + 'Test.js', renderedTemplates.tests.model);
	});
}

/**
 *
 * @param pack
 * @param template
 * @param [rest]
 * @returns {string}
 */
function renderTemplate (pack, template, rest) {
	if (rest) {
		template = S(template).replaceAll('__routeRest__',
			os.EOL +
			'/**' + os.EOL +
			' * Enable Rest API url' + os.EOL +
			' * Config Rest API on \'RestController.js\'' + os.EOL +
			' */' + os.EOL +
			'__lowerPACKAGE__Router.setRestApi(\'/api/__lowerPACKAGE__/\');' +
			os.EOL);
	}
	else {
		template = S(template).replaceAll('__routeRest__', '');
	}

	template = template
		.replaceAll('__PACKAGE__', pack)
		.replaceAll('__lowerPACKAGE__', pack.toLowerCase());

	if (rode.getConfig().views.engine === 'soy') {
		template = template.replaceAll('//{{render}}//', 'function: \'index\',');
	}
	else {
		template = template.replaceAll('//{{render}}//', '');
	}

	return template.s;
}

module.exports = packages;