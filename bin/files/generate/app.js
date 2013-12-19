/**
 * Module dependencies.
 */
var rode = require('rode');

rode.start(__dirname, function (err) {
	var app = rode.app; // express.app() configured!
	app.use(rode.express.json());
	app.use(rode.express.urlencoded());
	app.use(rode.express.methodOverride());{sess}

	rode.startServer(function () {
		console.log('Server started on ' + rode.env + '!');
	});
});