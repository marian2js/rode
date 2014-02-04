/**
 * Module dependencies.
 */
var expect = require('expect.js'),
	rode = require('rode');

var MainModel = rode.getModel('Main');

describe('Main Model', function () {

    it('should support new instances', function () {
        var instance = new MainModel({
            name: 'Test instance',
            test: true
        });
        expect(instance instanceof MainModel).to.be(true);
        expect(instance.has('name')).to.be(true);
        expect(instance.get('name')).to.be('Test instance');
        expect(instance.has('test')).to.be(true);
        expect(instance.get('test')).to.be(true);
    });
});
