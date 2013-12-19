var _ = require('underscore'),
	mongoose = require('mongoose');
require('mongoose-schema-extend');

var Schema = mongoose.Schema;

var modelError = 'Error: The Model need name and schema before compile it';

var Model = {
	/**
	 * Extends a Model
	 *
	 * @param submodel
	 * @returns {Model}
	 */
	extend: function (submodel) {
		submodel.super = this;
		return _.extend(this.clone(), submodel);
	},

	/**
	 * Create a new extensible schema
	 *
	 * @api public
	 * @param newSchema
	 * @param [options]
	 * @returns {mongoose.Schema}
	 */
	setSchema: function (newSchema, options) {
		this.model = null;
		options = _.extend({
			discriminatorKey: '_type',
			collection: this.name
		}, options);
		if (this.super && this.super.schema) {
			options.collection = this.super.__collectionName;
			this.schema = this.super.schema.extend(newSchema);
		}
		else {
			this.schema = new Schema(newSchema, options);
			this.__discriminatorKey = options.discriminatorKey;
			this.__collectionName = options.collection;
		}
		return this.schema;
	},

	/**
	 * Check if this model has schema
	 *
	 * @returns {boolean}
	 */
	hasSchema: function () {
		return !!(this.schema);
	},

	/**
	 * Compile Model's Schema
	 *
	 * @returns {Function}
	 */
	compile: function () {
		if (!this.name || !this.schema) {
			throw new Error(modelError);
		}
		if (this.super.hasSchema()) {
			this.super.compile();
		}
		this.model = mongoose.model(this.name, this.schema);
		return this.model;
	},

	/**
	 * Check if this model is compiled
	 *
	 * @returns {boolean}
	 */
	isCompiled: function () {
		return !!(this.model);
	},

	/**
	 * Find an element on this Model
	 *
	 * @param query
	 * @param cb
	 */
	find: function (query, cb) {
		if (!this.model) {
			throw new Error('Error: The Model is not yet compiled!');
		}
		if(this.super.schema) {
			if (!query[this.__discriminatorKey]) {
				query[this.__discriminatorKey] = this.name;
			}
		}
		this.model.find(query, cb);
	},

	/**
	 * Find one element on this Model
	 *
	 * @param query
	 * @param cb
	 */
	findOne: function (query, cb) {
		if (!this.model) {
			throw new Error('Error: The Model is not yet compiled!');
		}
		if(this.super.schema) {
			query = _.extend({
				_type: this.name
			}, query);
		}
		this.model.findOne(query, cb);
	},

	/**
	 * Find element by Id
	 *
	 * @param id
	 * @param cb
	 */
	findById: function (id, cb) {
		if (!this.model) {
			throw new Error('Error: The Model is not yet compiled!');
		}
		this.model.findById(id, cb);
	},

	/**
	 * Get all elements on this Model
	 *
	 * @param cb
	 */
	getAll: function (cb) {
		this.find({}, cb);
	},

	clone: function () {
		return _.clone(this);
	},

	/**
	 * Get Model's name
	 *
	 * @returns {String}
	 */
	toString: function () {
		return this.name || 'Controller';
	}
};

module.exports = Model;