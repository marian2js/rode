/**
 * Module dependencies.
 */
var _path = require('path'),
	os = require('os'),
	soynode = require('soynode'),
	rode = require('../../../rode');

var Views = rode.getCoreModel('Views');

var SoyView = Views.extend((function () {
	var self = {
		name: 'SoyView'
	};

	/**
	 * Config Google Closure Templates
	 *
	 * @link http://www.technology-ebay.de/the-teams/mobile-de/blog/node-js-with-express-and-closure-templates.html
	 * @param app
	 * @param views
	 */
	self.configEngine = function (app, views) {
		soynode.setOptions({
			outputDir: os.tmpdir(),
			uniqueDir: true,
			allowDynamicRecompile: true,
			eraseTemporaryFiles: true
		});
		app.set('view engine', '.soy');

		var soyRenderer = function(path, options, callback) {
			var templatePath = path.replace(_path.normalize(this.root + '/'), '');
			templatePath = templatePath.replace('.soy', _path.sep + options['function']);
			templatePath = templatePath.split(_path.sep).join('.');
			callback(null, options.soynode.render(templatePath, options));
		};

		app.engine('.soy', soyRenderer);
		app.use(function(req, res, next) {
			res.locals.soynode = soynode;
			next();
		});
	};

	/**
	 * Compile Google Closure Templates
	 *
	 * @link http://www.technology-ebay.de/the-teams/mobile-de/blog/node-js-with-express-and-closure-templates.html
	 * @param {Function} cb
	 */
	self.compile = function (cb) {
		soynode.compileTemplates(rode.getConfig().views.dir, function(err) {
			if (err) {
				cb(err);
				return;
			}
			cb(null);
		});
	};

	return self;
})());

module.exports = SoyView;