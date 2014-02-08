/**
 * Module dependencies.
 */
var rode = require('../../../rode');

var MainController = (function () {
	var self = {};
    var viewModel;
	var view;
	var engine;

	/**
	 * Config View Engine
	 */
	self.configEngine = function () {
        view = new (self.getView())();
        view.configEngine(rode.app, rode.getConfig().views);
	};

	self.compile = function (cb) {
        view.compile(cb);
	};

	self.getView = function () {
		self.getEngine();
		if (!viewModel) {
			switch (engine) {
				case 'ejs':
                    viewModel = rode.getCoreModel('Views', 'EjsView');
					break;
				case 'soy':
                    viewModel = rode.getCoreModel('Views', 'SoyView');
					break;
				default:
                    viewModel = rode.getCoreModel('Views');
			}
		}
		return viewModel;
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