var path = require('path');
var expect = require('expect.js');
import { Config } from '../Config';

describe('Config', () => {
  // mock app with .json options
  var fakePath = path.join(__rodeBase, 'mockApp');

  it('should allow to be newed', () => {
    var config = new Config(fakePath);
    expect(config).to.be.a(Config);
  });

  it('should load config.json file in their options', () => {
    var config = new Config(fakePath);
    expect(config.options).to.be.an(Object);
    expect(config.options.fake_option).to.be(123456);
    expect(config.options.fake_array).to.be.an(Array);
    expect(config.options.fake_array[0]).to.be.an(Object);
    expect(config.options.fake_array[1]).to.be.an(Object);
    expect(config.options.fake_array[0].item1).to.be(1);
    expect(config.options.fake_array[0].item2).to.be(2);
    expect(config.options.fake_array[0].item3).to.be(3);
    expect(config.options.fake_array[1].item1).to.be(4);
    expect(config.options.fake_array[1].item2).to.be(5);
    expect(config.options.fake_array[1].item3).to.be(6);
  });

  it('should load environment json options without remove config.json', () => {
    var config = new Config(fakePath, 'test');
    expect(config.options).to.be.an(Object);
    expect(config.options.fake_option).to.be(654321);
    expect(config.options.another_option).to.be('abcdef');
  });

  describe('CRUD operations', () => {
    var config;

    /**
     * Create a config instance with ./mock/config/config.json options
     */
    beforeEach(() => config = new Config(fakePath));

    it('should get an element by key', () => {
      expect(config.get('fake_option')).to.be(123456);
      expect(config.get('NONEXISTENT OPTION')).to.be(undefined);
    });

    it('should set an element by key', () => {
      config.set('my_option', 'my value');
      config.set('fake_option', 'changed value');
      expect(config.get('my_option')).to.be('my value');
      expect(config.get('fake_option')).to.be('changed value');
    });

    it('should if config contains an option', () => {
      expect(config.has('fake_option')).to.be(true);
      expect(config.has('NONEXISTENT OPTION')).to.be(false);
    });

    it('should remove an element by key', () => {
      config.remove('fake_option');
      expect(config.has('fake_option')).to.be(false);
      expect(config.get('fake_option')).to.be(undefined);
      expect(() => config.remove('NONEXISTENT OPTION')).to.not.throwError();
    });

    it('should remove all the options', () => {
      config.clear();
      expect(config.options).to.be.empty();
    });
  });

});