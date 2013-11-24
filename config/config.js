var path = require('path'),
	_ = require('underscore');

var rootPath = path.join(__dirname, '/../');

var config = {
	rootPath: rootPath,
	srcDir: rootPath + 'src',
	port: process.env.PORT || 3000,
	db: process.env.MONGOHQ_URL
};

module.exports = function (env) {
	if (!env) {
		env = process.env.NODE_ENV || 'development';
	}
	_.extend(config, require(rootPath + 'config/' + env) || {});

	return config;
};