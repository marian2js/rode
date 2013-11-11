var expect = require('expect.js');

var rode = require('../../../../rode');
var Mongo = rode.getCoreComponent('DB', 'Mongo');

describe('Mongo', function () {
	it('should connect to MongoDB', function (done) {
		var db = Mongo.getDb();
		expect(db.connections).to.be.a('object');
		done();
	});

	it('should only connect once to MongoDB', function (done) {
		var db = Mongo.getDb();
		db = Mongo.getDb();
		expect(db.connections).to.be.a('object');
		done();
	});

	it('should extend Mongoose', function (done) {
		expect(Mongo.Schema).to.be.a('function');
		done();
	});
});