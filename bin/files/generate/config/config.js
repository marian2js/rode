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
	srcDir: path.join(rootPath, 'src'),
	staticsDir: path.join(rootPath, 'public'),
	mongo: {
		uri: 'mongodb://localhost/app_name',
		options: {},
		autoconnect: true
	},
	db: process.env.MONGOHQ_URL,
	views: {
		dir: rootPath + 'views',
		engine: '{ViewsTemplate}'
	},
	favicon: rode.express.favicon(),
	logger: rode.express.logger(),
	bodyParser: true,
	css: '{css}'
};

module.exports = function (env) {
	if (!env) {
		env = process.env.NODE_ENV || 'development';
	}
	_.extend(config, require(rootPath + 'config/' + env) || {});

	return config;
};