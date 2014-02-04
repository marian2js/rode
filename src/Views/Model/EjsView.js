/**
 * Module dependencies.
 */
var ejs = require('ejs-locals'),
    rode = require('../../../rode');

var Views = rode.getCoreModel('Views');

var EjsView = Views.extend({

    /**
     * Initialize View Engine
     *
     * @param app
     * @param views
     */
	initialize: function (app, views) {
		this.super.configEngine(app, views);
		app.engine('ejs', ejs);
	}
});

module.exports = EjsView;