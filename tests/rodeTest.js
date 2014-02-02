var expect = require('expect.js'),
	rode = require('../rode'),
	_path = require('path');

describe('Rode.js', function () {

	/**
	 * Check if Rode is loaded correctly
	 */
	it('should load rode.js', function () {
		expect(rode).to.be.an('object');
	});

	/**
	 * Check if Rode starts fine
	 */
	it('should start rode.js', function (done) {
		expect(rode.isStarted()).to.not.be.ok();
		rode.start(_path.resolve(__dirname, '../'), function (err) {
			expect(err).to.not.be.ok();
			expect(rode.isStarted()).to.be.ok();
			done();
		});
	});

	/**
	 * Check if core config is loaded
	 */
	it('should load core config', function () {
		var config = rode.getCoreConfig();
		expect(config).to.be.an('object');
		expect(config.rootPath).to.be.a('string');
		expect(config.srcDir).to.be.a('string');
	});

	/**
	 * Check if core controllers are loaded okay
	 */
	it('should load core controller', function () {
		var Router = rode.getCoreController('Router');
		expect(Router).to.be.ok();
	});

	/**
	 * Check if core models are loaded okay
	 */
	it('should load core model', function () {
		var model = rode.getCoreModel('Abstract', 'Model');
		expect(model).to.be.an('object');
		expect(model.extend).to.be.a('function');
	});

	/**
	 * Check if core packages are returned okay
	 */
	it('should return all core packages', function (done) {
		rode.packages.getAllCore(function (err, packs) {
			expect(err).to.be(null);
			expect(packs).to.be.an('array');
			expect(packs).to.not.be.empty();
			done();
		});
	});
});