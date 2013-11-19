/**
 * Module dependencies.
 */
var rode = require('rode');

var __PACKAGE__ = rode.getModel('__PACKAGE__');

/**
 * Main Controller of __PACKAGE__
 */
var MainController = {

	/**
	 * index Action
	 */
	index: function (req, res) {
		res.render('__PACKAGE__/index', {
			title: 'Index of __PACKAGE__'
		});
	}
};

module.exports = MainController;