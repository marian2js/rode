/**
 * Module dependencies.
 */
var http = require('http'),
	expect = require('expect.js'),
	rode = require('rode');

describe('Main Controller', function () {
	var config = rode.getConfig();

	it('should respond to /hello with "Hello World!"', function (done) {
		var options = {
			host: config.baseUri,
			path: '/hello',
			port: config.port,
			method: 'GET'
		};
		http.request(options, function (response) {
			var str = '';
			response.on('data', function (chunk) {
				str += chunk;
			});
			response.on('end', function () {
				expect(str).to.contain('Hello World!');
				done();
			});
		});
	});
});

