/**
 * Module dependencies.
 */
var rode = require('rode');

var Model = rode.getBaseModel();

/**
 * Main Model
 */
var __PACKAGE__ = Model.extend({
	name: '__PACKAGE__'
});

/**
 * __PACKAGE__ Schema (for mongoose)
 */
__PACKAGE__.setSchema({
	name: String,
	description: String
});

/**
 * Validators
 */
__PACKAGE__.schema.path('name').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

/**
 * Compile __PACKAGE__ Module (only needed if use MongoDB)
 */
__PACKAGE__.compile();