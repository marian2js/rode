/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	_ = require('underscore'),
	rode = require('../../../rode');

var db = null;

/**
 * @param env
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
		}
		return db;
	}
};

module.exports = _.extend(Mongo, mongoose);