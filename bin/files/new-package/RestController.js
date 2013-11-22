/**
 * Module dependencies.
 */
var rode = require('rode');

var __PACKAGE__ = rode.getModel('__PACKAGE__');

/**
 * Rest Controller of __PACKAGE__
 */
var RestController = {

	/**
	 * Responds to /api/__lowerPACKAGE__
	 * Method GET
	 */
	get: function (req, res) {
		var obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__
	 * Method POST
	 */
	post: function (req, res) {
		var obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/sponsored
	 * Method GET
	 */
	getSponsored: function (req, res) {
		var obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/sponsored
	 * Method POST
	 */
	postSponsored: function (req, res) {
		var obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/sponsored/today
	 * Method PUT
	 */
	putSponsoredToday: function (req, res) {
		var obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/:id
	 * Method GET
	 */
	getById: function (req, res) {
		var __lowerPACKAGE__Id = req.params.id,
			obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/:id
	 * Method PUT
	 */
	putById: function (req, res) {
		var __lowerPACKAGE__Id = req.params.id,
			obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/:id/comments
	 * Method GET
	 */
	getByIdComments: function (req, res) {
		var __lowerPACKAGE__Id = req.params.id,
			obj = {};
		res.send(JSON.stringify(obj));
	},

	/**
	 * Responds to /api/__lowerPACKAGE__/:id/comments/:id2
	 * Method DELETE
	 */
	deleteByIdCommentsById: function (req, res) {
		var __lowerPACKAGE__Id = req.params.id,
			commentId = req.params.id2,
			obj = {};
		res.send(JSON.stringify(obj));
	}
};

module.exports = RestController;