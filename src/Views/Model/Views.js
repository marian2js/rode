var rode = require('../../../rode');

var Views = rode.Model.extend({

    /**
     * Config View Engine
     *
     * @param app
     * @param views
     */
    configEngine: function (app, views) {
        app.set('views', views.dir || '');
        app.set('view engine', views.engine || 'jade');
    },

    /**
     * Compile Views, this is here for extensions
     *
     * @param {Function} cb
     */
    compile: function (cb) {
        cb(null);
    }
});

module.exports = Views;