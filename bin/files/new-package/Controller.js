/**
 * Module dependencies.
 */
var rode = require('rode');

var __PACKAGE__ = rode.getModel('__PACKAGE__');

/**
 * Main Controller of __PACKAGE__
 */
var __PACKAGE__Controller = {

	/**
	 * index Action
	 */
	index: function (req, res) {
		res.render('__PACKAGE__/index', {
			//{{render}}//
			title: 'Index of __PACKAGE__'
		});
	}
};

module.exports = __PACKAGE__Controller;