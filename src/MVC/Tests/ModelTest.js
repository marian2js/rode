var expect = require('expect.js');
import { Model } from '../Model';

describe('Model', () => {

  /**
   * Test if extends to Observable
   */
  it('should be observable', () => {
    expect(Model.isObservable).to.be(true);
  });

  describe('Constructor', () => {

    it('should load an object passed on the constructor into the model instance', () => {
      var data = {
        name: 'Test',
        val: 'value'
      };
      var model = new Model(data);
      expect(model.name).to.be(data.name);
      expect(model.val).to.be(data.val);
      model.val = 'new value';
      expect(model.val).to.be('new value');
    });
    
    it('should create a empty model if no parameters are given', () => {
      var model = new Model();
      model.name = 'Test';
      expect(model).to.be.a(Model);
      expect(model.name).to.be('Test');
    });

  });

});