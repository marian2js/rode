var _ = require('underscore');

var rootDir = __dirname + '/../';

var config = {
	rootDir: rootDir,
	srcDir: rootDir + 'src',
	port: process.env.PORT || 3000,
	db: process.env.MONGOHQ_URL
};

module.exports = function (env) {
	if (!env) {
		env = process.env.NODE_ENV || 'development';
	}
	_.extend(config, require(rootDir + 'config/' + env) || {});

	return config;
};