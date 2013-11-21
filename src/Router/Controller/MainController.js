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
			return this;
		},
		get: function (route) {
			this.add(_.extend(route, { method: 'get' }));
			return this;
		},
		post: function (route) {
			this.add(_.extend(route, { method: 'post' }));
			return this;
		},
		all: function (route) {
			this.add(_.extend(route, { method: 'all' }));
			return this;
		},
		forEach: function (cb) {
			Router.forEach(pack, function (route) {
				cb(route);
			});
		},
		remove: function (route) {
			Router.remove(pack, route);
			return this;
		},
		getPath: function (action) {
			return Router.getPath(pack, action);
			return this;
		},
		setBase: function (base) {
			Router.setBase(pack, base);
			return this;
		}
	};
};

module.exports = MainController;