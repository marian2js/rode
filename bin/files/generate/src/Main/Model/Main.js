/**
 * Module dependencies.
 */
var rode = require('rode');

var Model = rode.getBaseModel();

/**
 * Main Model
 */
var Main = Model.extend({
	name: 'Main'
});

/**
 * Main Schema (for mongoose)
 */
Main.setSchema({
	name: String,
	description: String
});

/**
 * Validators
 */
Main.schema.path('name').validate(function (name) {
	return name.length;
}, 'Name cannot be blank');

/**
 * Compile Main Module (only needed if use MongoDB)
 */
Main.compile();

module.exports = Main;