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
 * Responds to /hello with MainController.sayHello
 */
mainRouter.add({
	pattern: 'hello',
	action: 'sayHello',
	method: 'get'
});
