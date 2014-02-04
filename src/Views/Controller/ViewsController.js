/**
 * Module dependencies.
 */
var _ = require('underscore'),
	rode = require('../../../rode');

var Views = rode.getCoreModel('Views');

var MainController = (function () {
	var self = {};
	var View;
	var engine;

	/**
	 * Config View Engine
	 */
	self.configEngine = function () {
		self.getView().configEngine(rode.app, rode.getConfig().views);
	};

	self.compile = function (cb) {
		self.getView().compile(cb);
	};

	self.getView = function () {
		self.getEngine();
		if (!View) {
			switch (engine) {
				case 'ejs':
					View = rode.getCoreModel('Views', 'EjsView');
					break;
				case 'soy':
					View = rode.getCoreModel('Views', 'SoyView');
					break;
				default:
					View = rode.getCoreModel('Views');
			}
		}
		return View;
	};

	self.getEngine = function () {
		if (!engine) {
			engine = rode.getConfig().views.engine;
		}
		return engine;
	};

	return self;
})();

module.exports = MainController;