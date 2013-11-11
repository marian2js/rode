/**
 * Module dependencies.
 */
var rode = require('rode');
var mainRouter = rode.getRouter('Main');

/**
 * Base Route for this Package (Optional)
 */
mainRouter.setBase('/');

/**
 * Responds to /
 * With MainController.index
 */
mainRouter.add({
	pattern: '',
	action: 'index',
	method: 'get'
});

/**
 * Responds to /hello
 * With MainController.sayHello
 */
mainRouter.add({
	pattern: 'hello',
	action: 'sayHello',
	method: 'get'
});
