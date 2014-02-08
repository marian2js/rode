/**
 * Module dependencies.
 */
var ejs = require('ejs-locals'),
    rode = require('../../../rode');

var Views = rode.getCoreModel('Views');

var EjsView = Views.extend({

    /**
     * Config View Engine
     *
     * @param app
     * @param views
     */
    configEngine: function (app, views) {
        EjsView.__super__.configEngine(app, views);
		app.engine('ejs', ejs);
	}
});

module.exports = EjsView;