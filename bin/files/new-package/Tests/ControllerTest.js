/**
 * Module dependencies.
 */
var http = require('http'),
	expect = require('expect.js'),
	rode = require('rode');

describe('__PACKAGE__ Controller', function () {
	var config = rode.getConfig();

	it('should respond to /__lowerPACKAGE__/ with "Index of __PACKAGE__"', function (done) {
		var options = {
			host: config.host,
			path: '/__lowerPACKAGE__/',
			port: config.port,
			method: 'GET'
		};
		http.request(options, function (response) {
			expect(response.statusCode).to.be(200);
			var str = '';
			response.on('data', function (chunk) {
				str += chunk.toString();
			});
			response.on('end', function () {
				expect(str).to.contain('Index of __PACKAGE__');
				done();
			});
		}).end();
	});
});

