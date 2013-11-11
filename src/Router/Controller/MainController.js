/**
 * Module dependencies.
 */
var _ = require('underscore'),
	rode = require('../../../rode');

var Router = rode.getCoreModel('Router');

var MainController = function (pack) {
	return {
		add: function (route) {
			Router.add(pack, route);
		},
		get: function (route) {
			this.add(_.extend(route, { method: 'get' }));
		},
		post: function (route) {
			this.add(_.extend(route, { method: 'post' }));
		},
		all: function (route) {
			this.add(_.extend(route, { method: 'all' }));
		},
		forEach: function (cb) {
			Router.forEach(pack, function (route) {
				cb(route);
			});
		},
		remove: function (route) {
			Router.remove(pack, route);
		},
		getPath: function (action) {
			return Router.getPath(pack, action);
		},
		setBase: function (base) {
			Router.setBase(pack, base);
		}
	};
};

module.exports = MainController;