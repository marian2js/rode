/**
 * Module dependencies.
 */
var path = require('path'),
	rode = require('../../../rode');

var Model = rode.getBaseModel();

var Router = Model.extend({
	name: 'Router',
	routes: {},
	bases: {},
	add: function (pack, route) {
		if (!this.routes[pack]) {
			this.routes[pack] = [];
		}
		this.routes[pack].push(route);
	},
	search: function (pack, needle) {
		var results = [];
		this.routes[pack].forEach(function (route) {
			if (needle.action && needle.action === route.action) {
				results.push(route);
			}
			else if (needle.pattern && needle.pattern === route.pattern) {
				results.push(route);
			}
		});
		return results;
	},
	searchByAction: function (pack, action) {
		return this.search(pack, { action: action });
	},
	searchByPattern: function (pack, pattern, cb) {
		return this.search(pack, { pattern: pattern });
	},
	searchOne: function (pack, needle) {
		var result = null;
		this.routes[pack].forEach(function (route) {
			if (result) {
				return;
			}
			if (needle.action && needle.action === route.action) {
				result = route;
			}
			else if (needle.pattern && needle.pattern === route.pattern) {
				result = route;
			}
		});
		return result;
	},
	searchOneByAction: function (pack, action) {
		return this.searchOne(pack, { action: action });
	},
	searchOneByPattern: function (pack, pattern) {
		return this.searchOne(pack, { pattern: pattern });
	},
	forEach: function (pack, cb) {
		this.routes[pack].forEach(function (route) {
			cb(route);
		});
	},
	remove: function (pack, route) {
		this.routes[pack].forEach(function (route) {
			if (needle.action && needle.action === route.action) {
				delete route;
			}
			else if (needle.pattern && needle.pattern === route.pattern) {
				delete route;
			}
		});
	},
	removeAll: function (pack) {
		delete this.routes[pack];
	},
	getPath: function (pack, action) {
		var base = this.getBase(pack);
		var route = this.searchOneByAction(pack, action);
		var routePath = path.join(base, route.pattern);
		if (routePath[0] !== '/') {
			routePath = '/' + routePath;
		}
		return routePath;
	},
	getBase: function (pack) {
		return this.bases[pack] || '';
	},
	setBase: function (pack, base) {
		this.bases[pack] = base;
	}
});

module.exports = Router;