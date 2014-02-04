var expect = require('expect.js'),
    rode = require('../../../../rode');

describe('Models', function () {

    /**
     * Check if a new instance of a Model can be created
     */
    it('should allow new instances', function () {
        var Person = rode.Model.extend();

        // Person should be a Function
        expect(Person).to.be.a('function');

        var person = new Person;
        expect(person).to.be.an('object');
    });

    /**
     * Check if the initialize of the new instance is called
     */
    it('should call a initialize of a new model', function (done) {
        var Person = rode.Model.extend({
            initialize: function () {
                // If initialize is not called, this test will end with error by timeout
                done();
            }
        });
        var john = new Person;
    });

    /**
     * Check if the initialize method get the parameters
     */
    it('should send all the parameters to the initialize method', function (done) {
        var Person = rode.Model.extend({
            initialize: function (param1, param2, paramArray) {
                expect(param1).to.be('First');
                expect(param2).to.be('Second');
                expect(paramArray).to.be.an('array');
                expect(paramArray[0]).to.be('Array');
                done();
            }
        });
        var person = new Person('First', 'Second', ['Array']);
    });

    /**
     * Check if get and set methods works as expected
     */
    it('should allow get and set attributes', function () {
        var Person = rode.Model.extend();
        var person = new Person;
        person.set({ name: 'Mariano', job: 'Developer' });
        person.set('age', 22);
        expect(person.get('name')).to.be('Mariano');
        expect(person.get('job')).to.be('Developer');
        expect(person.get('age')).to.be(22);
    });

    /**
     * Check if has method works as expected
     */
    it('should allow to check if an attribute was set', function () {
        var Person = rode.Model.extend();
        var person = new Person;
        person.set({ name: 'Mariano', age: 22 });
        expect(person.has('name')).to.be(true);
        expect(person.has(['name', 'age'])).to.be(true);
        expect(person.has(['name', 'undefined key'])).to.not.be.ok();
    });

    /**
     * Check if unset method works as expected
     */
    it('should allow to unset an attribute', function () {
        var Person = rode.Model.extend();
        var person = new Person;
        person.set({ name: 'Mariano', job: 'Developer', age: 22 });
        person.unset('name');
        person.unset(['job', 'age', 'undefined key']);
        expect(person.has('name')).to.not.be.ok();
        expect(person.has(['job', 'age'])).to.not.be.ok();
    });

    /**
     * Check if two instances have isolated attributes
     */
    it('should keep each instance isolated', function () {
        var Person = rode.Model.extend();
        var mariano = new Person;
        var john = new Person;
        mariano.set({ name: 'Mariano' });
        john.set({ name: 'John' });
        expect(mariano.get('name')).to.be('Mariano');
        expect(john.get('name')).to.be('John');
    });

    /**
     * Check if a model can be extended and properties are conserved
     */
    describe('Model.extend', function () {
        it('should extend a model', function () {
            var User = rode.Model.extend({
                initialize: function (name) {
                    this.set({ name: name });
                },
                canAdmin: false,
                canAccess: true
            });
            var SuperUser = User.extend({
                canAdmin: true
            });
            var superUser = new SuperUser('Mariano');
            expect(superUser.get('name')).to.be('Mariano');
            expect(superUser.canAccess).to.be(true);
            expect(superUser.canAdmin).to.be(true);
        });

        it('should keep parent Model unaltered', function () {
            var User = rode.Model.extend({
                canAdmin: false
            });
            var SuperUser = User.extend({
                canAdmin: true
            });
            var user = new User;
            expect(user.canAdmin).to.be(false);
        });

        it('should allow call super methods or attributes', function () {
            var User = rode.Model.extend({
                setUsername: function (username) {
                    this.set({ username: username });
                },
                getUsername: function () {
                    return this.get('username');
                }
            });
            var SuperUser = User.extend({
                initialize: function () {
                    this.setUsername('marian2js');
                }
            });
            var superUser = new SuperUser;
            expect(superUser.getUsername()).to.be('marian2js');
        });

        it('should be extensible in multiple levels', function () {
            var User = rode.Model.extend({
                canAccess: true,
                canModerate: false,
                canAdmin: false
            });
            var Moderator = User.extend({
                canModerate: true
            });
            var Admin = Moderator.extend({
                canAdmin: true
            });
            var admin = new Admin;
            expect(admin.canAccess).to.be(true);
            expect(admin.canModerate).to.be(true);
            expect(admin.canAdmin).to.be(true);
        });
    });

    describe('Mongoose support', function () {
        /**
         * Check if schema is working
         */
        it('should support Mongoose Schema', function () {
            var Person = rode.Model.extend({
                name: 'Person',
                schema: {
                    name: 'String'
                }
            });
            expect(Person._compile).to.be.a('function');
            expect(Person.getName()).to.be('Person');
            expect(Person.hasSchema()).to.be(true);
            expect(Person.getSchema()).to.be.an('object');
        });

        /**
         * Check if the mongoose schema is compiled with the first instance created
         */
        it('should compile schemas at demand', function () {
            var Person = rode.Model.extend({
                name: 'Person',
                schema: {
                    name: 'String'
                }
            });
            var person = new Person;
            expect(Person._isCompiled());
        });

        /**
         * Check if data can be saved in a mongoose object
         */
        it('should allow to create a Mongoose object', function () {
            var Person = rode.Model.extend({
                name: 'Person_2',
                schema: {
                    name: 'String',
                    age: 'Number'
                }
            });
            var person = new Person({
                name: 'Mariano',
                age: 22
            });
            expect(person.get('name')).to.be('Mariano');
            expect(person.get('age')).to.be(22);
        });

        /**
         * Check if a instance can be stored in MongoDB
         */
        it('should allow to save the instance on MongoDB', function (done) {
            var Person = rode.Model.extend({
                name: 'Person_3',
                schema: {
                    name: 'String',
                    age: 'Number'
                }
            });
            var person = new Person({
                name: 'Mariano',
                age: 22
            });

            // Store the person
            person.save(function (err) {
                expect(err).to.not.be.ok();

                // Find the object in MongoDB
                Person.findOne({ name: 'Mariano' }, function (err, result) {
                    expect(err).to.not.be.ok();
                    expect(result.get('name')).to.be('Mariano');
                    expect(result.get('age')).to.be(22);
                    done();
                });
            });
        });

        it('should allow extend Models with schema', function (done) {
            var User = rode.Model.extend({
                name: 'User',
                schema: {
                    username: 'String'
                },
                canAdmin: false
            });
            var Admin = User.extend({
                name: 'Admin',
                schema: {
                    email: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            var admin = new Admin({ username: 'Codexar', email: 'mail@example.com' });

            // Store the user
            user.save(function (err) {
                expect(err).to.not.be.ok();

                // Store the admin
                admin.save(function (err) {
                    expect(err).to.not.be.ok();

                    User.find(function (err, users) {
                        expect(err).to.not.be.ok();
                        expect(users.length).to.be.greaterThan(1);
                        expect(users[0] instanceof User).to.be(true);

                        Admin.find(function (err, admins) {
                            expect(err).to.not.be.ok();
                            expect(admins.length).to.be.greaterThan(1);
                            expect(admins[0] instanceof Admin).to.be(true);
                            done();
                        });
                    });

                });
            });

        });
    });

    describe('mongoose methods', function (done) {
        /**
         * Check find method
         */
        it('find', function (done) {
            var User = rode.Model.extend({
                name: 'User_find',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.find({ username: 'marian2js' }, function (err, docs) {
                    expect(err).to.not.be.ok();
                    expect(docs).to.be.an('array');
                    expect(docs[0].get('username')).to.be('marian2js');
                    expect(docs[0] instanceof User).to.be(true);
                    done();
                });
            });
        });

        /**
         * Check findById method
         */
        it('findById', function (done) {
            var User = rode.Model.extend({
                name: 'User_findById',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findById(user.get('_id'), function (err, doc) {
                    expect(err).to.not.be.ok();
                    expect(doc.get('_id').toString()).to.be(user.get('_id').toString());
                    expect(doc instanceof User).to.be(true);
                    done();
                });
            });
        });

        /**
         * Check findOne method
         */
        it('findOne', function (done) {
            var User = rode.Model.extend({
                name: 'User_findOne',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findOne(user.get('_id'), function (err, doc) {
                    expect(err).to.not.be.ok();
                    expect(doc.get('username').toString()).to.be('marian2js');
                    expect(doc instanceof User).to.be(true);
                    done();
                });
            });
        });

        /**
         * Check count method
         */
        it('count', function (done) {
            var User = rode.Model.extend({
                name: 'User_count',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.count(function (err, count) {
                    expect(err).to.not.be.ok();
                    expect(count).to.be.a('number');
                    expect(count).to.be.greaterThan(0);
                    done();
                });
            });
        });

        /**
         * Check distinct method
         */
        it('distinct', function (done) {
            var User = rode.Model.extend({
                name: 'User_distinct',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.distinct('username', function (err, result) {
                    expect(err).to.not.be.ok();
                    expect(result).to.be.an('array');
                    expect(result.length).to.be.greaterThan(0);
                    done();
                });
            });
        });

        /**
         * Check findOneAndUpdate method
         */
        it('findOneAndUpdate', function (done) {
            var User = rode.Model.extend({
                name: 'User_findOneAndUpdate',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findOneAndUpdate({ $set: { username: 'Codexar' } }, function (err, doc) {
                    expect(err).to.not.be.ok();
                    expect(doc.get('username')).to.be('Codexar');
                    expect(doc instanceof User).to.be(true);
                    done();
                });
            });
        });

        /**
         * Check findByIdAndUpdate method
         */
        it('findByIdAndUpdate', function (done) {
            var User = rode.Model.extend({
                name: 'User_findByIdAndUpdate',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findByIdAndUpdate(user.get('_id'), { $set: { username: 'Codexar' } }, function (err, doc) {
                    expect(err).to.not.be.ok();
                    expect(doc.get('_id').toString()).to.be(user.get('_id').toString());
                    expect(doc.get('username')).to.be('Codexar');
                    expect(doc instanceof User).to.be(true);
                    done();
                });
            });
        });

        /**
         * Check findOneAndRemove method
         */
        it('findOneAndRemove', function (done) {
            var User = rode.Model.extend({
                name: 'User_findOneAndRemove',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findOneAndRemove({ _id: user.get('_id') }, function (err, doc) {
                    expect(err).to.not.be.ok();

                    // Check if the document was removed successfully
                    User.findById(user.get('_id'), function (err, doc) {
                        expect(err).to.not.be.ok();
                        expect(doc).to.be(null);
                    });
                    done();
                });
            });
        });

        /**
         * Check findByIdAndRemove method
         */
        it('findByIdAndRemove', function (done) {
            var User = rode.Model.extend({
                name: 'User_findByIdAndRemove',
                schema: {
                    username: 'String'
                }
            });
            var user = new User({ username: 'marian2js' });
            user.save(function (err) {
                expect(err).to.not.be.ok();

                User.findByIdAndRemove(user.get('_id'), function (err, doc) {
                    expect(err).to.not.be.ok();

                    // Check if the document was removed successfully
                    User.findById(user.get('_id'), function (err, doc) {
                        expect(err).to.not.be.ok();
                        expect(doc).to.be(null);
                    });
                    done();
                });
            });
        });
    });
});