/**
 * Module dependencies.
 */
var rode = require('rode');
var __lowerPACKAGE__Router = rode.getRouter('__PACKAGE__');

/**
 * Base Route for this Package (Optional)
 */
__lowerPACKAGE__Router.setBase('/__lowerPACKAGE__/');

/**
 * Responds to /__lowerPACKAGE__/
 * With __PACKAGE__Controller.index
 */
__lowerPACKAGE__Router.add({
	pattern: '',
	action: 'index',
	method: 'get'
});