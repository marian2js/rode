var expect = require('expect.js'),
	rode = require('../rode');

describe('Rode.js', function () {

	/**
	 * Test Rode.js is loaded correctly
	 */
	it('should load rode.js', function (done) {
		expect(rode).to.be.a('object');
		done();
	});

	/**
	 * Test Config is loaded
	 */
	it('should load App Config', function (done) {
		var config = rode.getConfig();
		expect(config).to.be.a('object');
		expect(config.rootDir).to.be.a('string');
		expect(config.srcDir).to.be.a('string');
		done();
	});

	/**
	 * Test Core Config is loaded
	 */
	it('should load Core Config', function (done) {
		var config = rode.getCoreConfig();
		expect(config).to.be.a('object');
		expect(config.rootDir).to.be.a('string');
		expect(config.srcDir).to.be.a('string');
		done();
	});

	it('should load App Controller', function (done) {
		// TODO: Finish me!
		done();
	});

	it('should load Core Controller', function (done) {
		//var ctrl = rode.getCoreController('Abstract');
		// TODO: Finish me!
		done();
	});

	it('should load App Model', function (done) {
		// TODO: Finish me!
		done();
	});

	it('should load Core Model', function (done) {
		var model = rode.getCoreModel('Abstract', 'Model');
		expect(model).to.be.a('object');
		done();
	});

	it('should return all App Packages', function (done) {
		rode.getPackages(function (err, packs) {
			expect(err).to.be(null);
			expect(packs).to.be.a('array');
			done();
		});
	});
});