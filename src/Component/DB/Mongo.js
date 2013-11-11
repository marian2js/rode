/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('underscore'),
	rode = require('../../../rode');

var db = null;

/**
 * @api private
 */
var connectMongoose = function () {
	var config = rode.getConfig();
	return mongoose.connect(config.mongo.uri, config.mongo.options);
};

var Mongo = {
	getDb: function () {
		if (!db) {
			db = connectMongoose();
			mongoose.connection.on('error', function () {
				console.error('MongoDB not configured, please config or remove Mongo on config/config.js');
			});
		}
		return db;
	}
};

module.exports = _.extend(Mongo, mongoose);