/**
 * Module dependencies.
 */
var _path = require('path'),
	_ = require('underscore'),
	S = require('string'),
	rode = require('../../../rode');

var RoutingController = function (cb) {
	rode.packages.getAll(function (err, packs) {
		if (err) {
			cb(err);
			return;
		}
		packs.forEach(function (pack) {
			createRoutes(pack);
		});
		cb(null);
	});

	/**
	 * Create all routes
	 *
	 * @param {string} pack
	 */
	var createRoutes = function (pack) {
		var packRouter = rode.getRouter(pack),
			routePath = _path.join(rode.packages.getPath(pack), 'routes.js');
		require(routePath);
		packRouter.forEach(function (route) {
			var routePath = packRouter.getPath(route.action),
				controller = rode.getController(pack, route.controller),
				call = controller[route.action];

			// If call is an array, first item is a middleware
			if (_.isArray(call) && call.length > 1) {
				rode.app[route.method](routePath, call[0], call[1]);
			}
			else {
				rode.app[route.method](routePath, call);
			}
		});
		if (packRouter.isRestful()) {
			restRouter(pack, packRouter.getRestApi());
		}
	};

	/**
	 * Create all Rest routes
	 *
	 * @param {string} pack
	 * @param {string} base
	 */
	var restRouter = function (pack, base) {
		var restController = rode.getController(pack, 'Rest'),
			parts,
			method,
			path;

		for(var action in restController) {
			method = action.match(/[a-z]+/)[0];
			parts = S(action).replaceAll('ById','Byid').s.match(/[A-Z][a-z]+/g);
			path = _path.join(base, transformRoute(parts));
			if (S(path).endsWith('/')) {
				path = path.substr(0, path.length - 1);
			}
			rode.app[method](path, restController[action]);
		}
	};

	/**
	 * Transform the method on RestController to the api url
	 *
	 * @param {Array} parts
	 * @returns {string}
	 */
	var transformRoute = function (parts) {
		var path = '',
			ids = 0,
			count;
		if (!parts) {
			return '';
		}
		count = parts.length;
		for (var i = 0; i < count; i++) {
			if (parts[i] === 'Byid') {
				if (ids) {
					path += ':id' + ++ids + '/'
				}
				else {
					path += ':id/';
					ids++;
				}
			}
			else {
				path += parts[i] + '/';
			}
		}
		return path.toLowerCase();
	};
};

module.exports = RoutingController;