/**
 * Module dependencies.
 */
var rode = require('rode');

var app = rode.app; // express.app() configured!
app.use(rode.express.json());
app.use(rode.express.urlencoded());
app.use(rode.express.methodOverride());{sess}

rode.start(__dirname, function (err) {
	rode.startServer(function () {
		console.log('Server Started!');
	});
});