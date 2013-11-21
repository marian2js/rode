var expect = require('expect.js'),
	mongoose = require('mongoose'),
	rode = require('../../../../rode');

var Model = rode.getBaseModel();

describe('Model', function () {
	it('should be extensible', function (done) {
		var Son = Model.extend({
			name: 'Son'
		});
		expect(Son).to.be.a('object');
		expect(Son.name).to.be('Son');
		done();
	});

	it('should be extensible in multiple levels', function (done) {
		var Son = Model.extend({
			name: 'Son',
			color: 'blue'
		});
		expect(Son.extend).to.be.a('function');
		var GrandSon = Son.extend({
			name: 'Grand Son'
		});
		expect(GrandSon).to.be.a('object');
		expect(GrandSon.name).to.be('Grand Son');
		expect(GrandSon.color).to.be(Son.color);
		// Do not break original model
		expect(Son.name).to.be('Son');
		done();
	});

	it('should allow multiple objects from one model', function (done) {
		var Son = Model.extend({
			name: 'Son'
		});
		var GrandSon = Son.extend({
			name: 'Grand Son 1'
		});
		var GrandSon2 = Son.extend({
			name: 'Grand Son 2'
		});
		expect(Son.name).to.be('Son');
		expect(GrandSon.name).to.be('Grand Son 1');
		expect(GrandSon2.name).to.be('Grand Son 2');
		done();
	});

	it('should support super access', function (done) {
		var Son = Model.extend({
			name: 'Son'
		});
		var GrandSon = Son.extend({
			name: 'Grand Son'
		});
		expect(GrandSon.super.name).to.be('Son');
		done();
	});

	it('should support Mongoose Schema', function (done) {
		var Son = Model.extend({
			name: 'Son'
		});
		expect(Son.hasSchema()).to.be(false);
		Son.setSchema({
			name: 'String',
			age: 'Number'
		});
		expect(Son.hasSchema()).to.be(true);
		Son.compile();
		expect(Son.model).to.be.a('function');
		expect(mongoose.model('Son')).to.be.a('function');
		done();
	});

	it('should compile models without errors', function (done) {
		var SomeModel = Model.extend({
			name: 'Some Model'
		});
		SomeModel.setSchema({
			val1: 'String',
			val2: 'String',
			num1: 'Number'
		});
		SomeModel.compile();
		expect(SomeModel.isCompiled()).to.be(true);
		done();
	});

	it('should allow multiple instances', function (done) {
		var Person = Model.extend({
			name: 'Person'
		});
		Person.setSchema({
			name: 'String',
			age: 'Number'
		});
		Person.compile();
		var marian = new Person.model({
			name: 'Mariano Pardo',
			age: 22
		});
		expect(marian.name).to.be('Mariano Pardo');
		expect(marian.age).to.be(22);
		var john = new Person.model({
			name: 'John',
			age: 40
		});
		expect(john.name).to.be('John');
		expect(john.age).to.be(40);
		expect(marian.name).to.be('Mariano Pardo');
		done();
	});

	it('should save data without errors', function (done) {
		var Animal = Model.extend({
			name: 'Animal'
		});
		Animal.setSchema({
			type: 'String'
		});
		Animal.compile();
		var dog = new Animal.model({
			type: 'dog'
		});
		dog.save(function (err) {
			expect(err).to.be(null);
			done();
		});
	});

	it('should find all elements', function (done) {
		var AModel = Model.extend({
			name: 'A Model'
		});
		AModel.setSchema({
			val: 'String',
			num: 'Number',
			bool: 'Boolean'
		});
		AModel.compile();
		var item = new AModel.model({
			val: 'Hello Rode',
			num: 123,
			bool: true
		});
		item.save(function (err) {
			AModel.getAll(function (err, items) {
				expect(err).to.be(null);
				expect(items).to.be.a('array');
				expect(items[0].val).to.be('Hello Rode');
				AModel.model.remove({}, function (err) {
					AModel.getAll(function (err, items) {
						expect(err).to.be(null);
						expect(items.length == 0).to.be(true)
						done();
					});
				});
			});
		});
	});

	it('should allow Schemas extend', function (done) {
		var Person = Model.extend({
			name: 'Person Model'
		});
		Person.setSchema({
			name: {
				type: 'String',
				unique: true
			},
			age: {
				type: 'Number',
				default: 0
			}
		});
		var Employee = Person.extend({
			name: 'Employee Model'
		});
		Employee.setSchema({
			company: 'String'
		});
		var Guest = Person.extend({
			accessTime: 'Number'
		});

		// Compile all models
		Person.compile();
		Employee.compile();
		Guest.compile();

		// Create same persons
		var john = new Person.model({
			name: 'John',
			age: 40
		});
		var mariano = new Employee.model({
			name: 'Mariano Pardo',
			age: '22',
			company: 'Codexar'
		});
		var mike = new Guest.model({
			name: 'Mike',
			age: 25,
			accessTime: 3000
		});

		// Test all!
		Person.model.remove({}, function (err) {
			mariano.save(function (err) {
				expect(err).to.be(null);
				john.save(function (err) {
					expect(err).to.be(null);
					mike.save(function (err) {
						Employee.getAll(function (err, emp) {
							expect(err).to.be(null);
							expect(emp).to.be.a('array');
							expect(emp.length).to.be(1);
							Person.getAll(function (err, pers) {
								expect(pers).to.be.a('array');
								expect(pers.length).to.be(3);
								done();
							});
						});
					});
				});
			});
		});
	});

	it('if parent has not Schema, but Grandpa has, extend for Grandpa', function (done) {
		var GrandPa = Model.extend({
			name: 'GrandPa_'
		});
		GrandPa.setSchema({
			val: 'String',
			num: 'Number'
		});
		var Dad = GrandPa.extend({
			name: 'Dad_'
		});
		var Son = Dad.extend({
			name: 'Son_'
		});
		Son.setSchema({
			val2: 'String',
			num2: 'Number'
		});
		Son.compile();
		var mySon = new Son.model({
			val: 'Hello',
			num: 1,
			val2: 'World',
			num2: 2
		});
		mySon.save(function (err) {
			var query = {
				val: 'Hello',
				num: 1,
				val2: 'World',
				num2: 2
			};
			Son.find(query, function (err, items) {
				expect(items.length > 0).to.be(true);
				done();
			});
		});
	});
});