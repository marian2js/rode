/**
 * Module dependencies
 */
var _ = require('underscore'),
	path = require('path'),
	rode = require('rode');

var rootDir = rode.getRootDir();

var config = {
	baseUri: 'http://localhost',
	port: process.env.PORT || 3000,
	rootDir: rootDir,
	srcDir: path.join(rootDir, 'src'),
	staticsDir: path.join(rootDir, 'public'),
	mongo: {
		uri: 'mongodb://localhost/app_name',
		options: {},
		autoconnect: true
	},
	db: process.env.MONGOHQ_URL,
	views: {
		dir: rootDir + 'views',
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
	_.extend(config, require(rootDir + 'config/' + env) || {});

	return config;
};