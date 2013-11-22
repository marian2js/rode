/**
 * Module dependencies.
 */
var ejs = require('ejs-locals'),
	rode = require('../../../rode');

var Views = rode.getCoreModel('Views');

var EjsView = Views.extend((function () {
	var self = {
		name: 'EjsView'
	};

	self.configEngine = function (app, views) {
		self.super.configEngine(app, views);
		app.engine('ejs', ejs);
	};

	return self;
})());

module.exports = EjsView;