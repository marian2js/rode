var expect = require('expect.js');
var rode = require('../../../../rode');

describe('rode.Object', function () {

    /**
     * Check if new instances of Object can be created
     */
    it('should allow new instances', function () {
        var object = new rode.Object({
            key: 'value'
        });
        expect(object instanceof rode.Object).to.be(true);
        expect(object.key).to.be('value');
    });

    /**
     * Check if the initialize() method is called correctly
     */
    it('should call the initialize method of the new instances', function () {
        var myObject = new rode.Object({
            initialize: function () {
                this.name = 'my name'
            }
        });
        expect(myObject instanceof rode.Object).to.be(true);
        expect(myObject.initialize).to.be.a('function');
        expect(myObject.name).to.be('my name');
    });

    /**
     * Check if two instances of rode.Object are isolated
     */
    it('should keep isolated two instances', function () {
        var object1 = new rode.Object({
            name: 'object 1'
        });
        var object2 = new rode.Object({
            name: 'object 2'
        });
        expect(object1 instanceof rode.Object).to.be(true);
        expect(object2 instanceof rode.Object).to.be(true);
        expect(object1.name).to.be('object 1');
        expect(object2.name).to.be('object 2');
    });

    /**
     * Check if Object can be extended
     */
    it('should be extensible', function () {
        var MyClass = rode.Object.extend({
            getName: function () {
                return this.name
            }
        });
        var myInstance = new MyClass({
            name: 'my name'
        });
        expect(myInstance instanceof MyClass).to.be(true);
        expect(myInstance.getName()).to.be('my name');
        expect(MyClass.extend).to.be.a('function');
    });

    /**
     * Check if Object can be extended
     */
    it('should be extensible in multiple levels', function () {
        var MyClass = rode.Object.extend({
            getName: function () {
                return this.name
            }
        });
        var MyChildClass = MyClass.extend({
            initialize: function () {
                this.status = 'ok';
            },
            getUpperName: function () {
                return this.getName().toUpperCase();
            }
        });
        var myInstance = new MyChildClass({
            name: 'my name'
        });
        expect(myInstance instanceof MyClass).to.be(true);
        expect(myInstance.getUpperName()).to.be('MY NAME');
        expect(myInstance.status).to.be('ok');
        expect(MyChildClass.extend).to.be.a('function');
    });

    /**
     * Check if the Object is cloneable
     */
    it('should be cloneable', function () {
        var MyClass = rode.Object;
        var myInstance = new MyClass({
            name: 'my class'
        });
        var myInstance2 = myInstance.clone();
        expect(myInstance2).to.be.a(rode.Object);
        expect(myInstance2.name).to.be('my class');
        expect(myInstance2.clone).to.be.a('function');
        myInstance.name = 'other class';
        expect(myInstance2.name).to.be('my class');
    });

    /**
     * Check if a new listener can be added and triggered
     */
    it('should allow add event listeners', function () {
        var MyClass = rode.Object.extend({
            initialize: function () {
                expect(this.on).to.be.a('function');
                expect(this.trigger).to.be.a('function');

                this.on('event', function () {
                    this.name = 'my event';
                });
            }
        });
        var myInstance = new MyClass;
        expect(myInstance.on).to.be.a('function');
        expect(myInstance.trigger).to.be.a('function');
        myInstance.trigger('event');
        expect(myInstance.name).to.be('my event');
        myInstance.name = 'another name';
        myInstance.trigger('event');
        expect(myInstance.name).to.be('my event');
    });

    /**
     * Check if two instances have different events
     */
    it('should keep the events isolated between different objects', function () {
        var myInstance = new rode.Object;
        var myInstance2 = new rode.Object;
        myInstance.on('event', function () {
            this.name = 'instance 1'
        });
        myInstance2.on('event', function () {
            this.name = 'instance 2'
        });
        myInstance.trigger('event');
        myInstance2.trigger('event');
        expect(myInstance.name).to.be('instance 1');
        expect(myInstance2.name).to.be('instance 2');
    });
});