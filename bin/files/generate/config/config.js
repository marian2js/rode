/**
 * Module dependencies
 */
var _ = require('underscore'),
	path = require('path'),
	rode = require('rode');

var rootPath = rode.getRootPath() || path.resolve(__dirname, '../') + '/';

var config = {
	baseUri: 'http://localhost',
	port: process.env.PORT || 3000,

	// Config your directories and views
	srcDir: 'src',
	statics: {
		dir: 'public',
		images: 'images',
		js: 'js',
		css: 'css'
	},
	views: {
		dir: 'views',
		engine: '{ViewsTemplate}'
	},

	css: '{css}',
	mongo: {
		uri: 'mongodb://localhost/app_name',
		options: {},
		autoconnect: true
	},
	db: process.env.MONGOHQ_URL,
	favicon: rode.express.favicon(),
	bodyParser: true,
	errorHandler: true
};

module.exports = function (env) {
	if (!env) {
		env = process.env.NODE_ENV || 'development';
	}
	_.extend(config, require(rootPath + 'config/' + env) || {});
	rode.env = env;

	return config;
};
