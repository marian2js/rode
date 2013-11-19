/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	rode = require('rode');

var __PACKAGE__ = rode.getModel('__PACKAGE__');

describe('__PACKAGE__ Model', function () {
	var testData = {
		name: 'Instance of __PACKAGE__ Model',
		description: 'Hello, I am an instance of __PACKAGE__ Model'
	};

	it('should has name and description on their schema', function () {
		// Check if Main has Schema and it is compiled.
		expect(__PACKAGE__.hasSchema()).to.be(true);
		expect(__PACKAGE__.isCompiled()).to.be(true);

		// Create an instance of Main Model and test it.
		var test = __PACKAGE__.model(testData);
		expect(test).to.be.an('object');
		expect(test.name).to.be.equal(testData.name);
		expect(test.description).to.be.equal(testData.description);
		expect(test.save).to.be.a('function');
	});

	it('should save and remove name and description on MongoDB without error', function (done) {
		var test = __PACKAGE__.model(testData);
		__PACKAGE__.model.remove({}, function (err) {
			expect(err).to.not.be.ok();
			test.save(function (err) {
				expect(err).to.not.be.ok();
				__PACKAGE__.model.remove({}, function (err) {
					expect(err).to.not.be.ok();
					done();
				});
			});
		});
	});
});
