/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	rode = require('rode');

var Main = rode.getModel('Main');

describe('Main Model', function () {
	var testData = {
		name: 'Instance of Main Model',
		description: 'Hello, I am an instance of Main Model'
	};

	it('should has name and description on their schema', function () {
		// Check if Main has Schema and it is compiled.
		expect(Main.hasSchema()).to.be(true);
		expect(Main.isCompiled()).to.be(true);

		// Create an instance of Main Model and test it.
		var test = Main.model(testData);
		expect(test).to.be.an('object');
		expect(test.name).to.be.equal(testData.name);
		expect(test.description).to.be.equal(testData.description);
		expect(test.save).to.be.a('function');
	});

	it('should save and remove name and description on MongoDB without error', function (done) {
		var test = Main.model(testData);
		Main.model.remove({}, function (err) {
			expect(err).to.not.be.ok();
			test.save(function (err) {
				expect(err).to.not.be.ok();
				Main.model.remove({}, function (err) {
					expect(err).to.not.be.ok();
					done();
				});
			});
		});
	});
});
