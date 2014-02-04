var Views = (function () {
	var self = {};

	/**
	 * Config View Engine
	 *
	 * @param app
	 * @param views
	 */
	self.configEngine = function (app, views) {
		app.set('views', views.dir || '');
		app.set('view engine', views.engine || 'jade');
	};

	/**
	 * Compile Views, this is here for extensions
	 *
	 * @param {Function} cb
	 */
	self.compile = function (cb) {
		cb(null);
	};

	return self;
})();

module.exports = Views;