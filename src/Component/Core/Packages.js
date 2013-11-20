var _path = require('path'),
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
		return rode.getConfig().srcDir + '/' + pack;
	},

	/**
	 *
	 * @param pack
	 * @returns {string}
	 * @api public
	 */
	getCorePath: function (pack) {
		return rode.getCoreConfig().srcDir + '/' + pack;
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
		var path = rode.getConfig().srcDir;
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
			var srcPath = rode.getConfig().srcDir;
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
	 * @param [force]
	 */
	add: function (name, force) {
		name = S(name).capitalize();
		addPackage(name, !!force);
	},

	remove: function (name) {

	}
};

function addPackage (pack, force) {
	var filesPath = _path.normalize(rode.getCorePath() + 'bin/files/new-package/');
	var filesViewPath = _path.normalize(rode.getCorePath() + 'bin/files/views/');
	var destPath = _path.normalize(rode.getConfig().srcDir + '/' + pack);
	var viewPath = _path.normalize(rode.getConfig().views.dir + '/' + pack);

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
		routes: renderTemplate(pack, templates.routes),
		tests: {
			controller: renderTemplate(pack, templates.tests.controller),
			model: renderTemplate(pack, templates.tests.model)
		}
	};

	// Create Controllers
	utils.mkdir(destPath + '/Controller', function () {
		utils.write(destPath + '/Controller/MainController.js', renderedTemplates.controller);
		utils.write(destPath + '/routes.js', renderedTemplates.routes);
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
	});
	utils.mkdir(destPath + '/Tests/Model', function () {
		utils.write(destPath + '/Tests/Model/' + pack + 'Test.js', renderedTemplates.tests.model);
	});
}

function renderTemplate (pack, template) {
	template = S(template)
		.replaceAll('__PACKAGE__', pack)
		.replaceAll('__lowerPACKAGE__', pack.toLowerCase());

	if (rode.getConfig().views.engine === 'soy') {
		template = template.replaceAll('//{{render}}//', 'function: \'index\',');
	}
	else {
		template = template.replaceAll('//{{render}}//', '');
	}

	return template;
}

module.exports = packages;