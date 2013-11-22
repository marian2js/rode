/**
 * Module dependencies.
 */
var http = require('http'),
	expect = require('expect.js'),
	rode = require('rode');

describe('__PACKAGE__ Rest Controller', function () {
	var config = rode.getConfig();

	it('should respond to [GET] /api/__lowerPACKAGE__/ with JSON', function (done) {
		var options = {
			host: config.host,
			path: '/api/__lowerPACKAGE__/',
			port: config.port,
			method: 'GET'
		};
		http.request(options, function (response) {
			var json = '';
			response.on('data', function (chunk) {
				json += chunk.toString();
			});
			response.on('end', function () {
				var obj = JSON.parse(json);
				expect(obj).to.be.an('object');
				done();
			});
		}).end();
	});

	it('should respond to [POST] /api/__lowerPACKAGE__/ with JSON', function (done) {
		var options = {
			host: config.host,
			path: '/api/__lowerPACKAGE__/',
			port: config.port,
			method: 'POST'
		};
		http.request(options, function (response) {
			var json = '';
			response.on('data', function (chunk) {
				json += chunk.toString();
			});
			response.on('end', function () {
				var obj = JSON.parse(json);
				expect(obj).to.be.an('object');
				done();
			});
		}).end();
	});
});

