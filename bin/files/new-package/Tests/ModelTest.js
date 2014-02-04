/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	rode = require('rode');

var __PACKAGE__Model = rode.getModel('__PACKAGE__');

describe('__PACKAGE__ Model', function () {

    it('should support new instances', function () {
        var instance = new __PACKAGE__Model({
            name: 'Test __PACKAGE__ instance',
            test: true
        });
        expect(instance instanceof __PACKAGE__Model).to.be(true);
        expect(instance.has('name')).to.be(true);
        expect(instance.get('name')).to.be('Test __PACKAGE__ instance');
        expect(instance.has('test')).to.be(true);
        expect(instance.get('test')).to.be(true);
    });
});
