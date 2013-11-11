/**
 * Module dependencies.
 */
var rode = require('rode');

var Main = rode.getModel('Main');

var MainController = {

	/**
	 * index Action
	 */
	index: function (req, res) {
		res.render('index', {
			title: 'Hello RodeJS!'
		});
	},

	/**
	 * sayHello Action
	 */
	sayHello: function (req, res) {
		res.render('index', {
			title: 'Hello World!'
		});
	}
};

module.exports = MainController;