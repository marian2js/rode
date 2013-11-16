var expect = require('expect.js'),
	rode = require('../rode');

describe('Rode.js', function () {

	/**
	 * Test Rode.js is loaded correctly
	 */
	it('should load rode.js', function (done) {
		expect(rode).to.be.an('object');
		done();
	});

	/**
	 * Test Config is loaded
	 */
	it('should load App Config', function (done) {
		var config = rode.getCoreConfig();
		expect(config).to.be.an('object');
		expect(config.rootDir).to.be.a('string');
		expect(config.srcDir).to.be.a('string');
		done();
	});

	/**
	 * Test Core Config is loaded
	 */
	it('should load Core Config', function (done) {
		var config = rode.getCoreConfig();
		expect(config).to.be.an('object');
		expect(config.rootDir).to.be.a('string');
		expect(config.srcDir).to.be.a('string');
		done();
	});

	it('should load Core Controller', function (done) {
		var Router = rode.getCoreController('Router');
		expect(Router).to.be.ok();
		done();
	});

	it('should load Core Model', function (done) {
		var model = rode.getCoreModel('Abstract', 'Model');
		expect(model).to.be.an('object');
		expect(model.extend).to.be.a('function');
		done();
	});

	it('should return all Core Packages', function (done) {
		rode.getCorePackages(function (err, packs) {
			expect(err).to.be(null);
			expect(packs).to.be.an('array');
			done();
		});
	});
});