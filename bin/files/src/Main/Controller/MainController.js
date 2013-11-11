/**
 * Module dependencies.
 */
var rode = require('rode');

var Main = rode.getModel('Main');

var MainController = {

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