/**
 * Module dependencies
 */
var rode = require('rode');

var config = {
	logger: rode.express.logger('dev'),
	useErrorHandler: true
};
module.exports = config;