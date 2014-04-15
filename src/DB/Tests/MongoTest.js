var expect = require('expect.js');
import { Mongo } from '../Mongo';

describe('Mongo', () => {
  var fakeUri = 'mongodb://localhost/rode_tests';
  var mongo = new Mongo(fakeUri, {});

  /**
   * Test if a mongodb instance can be opened on 'mongodb://localhost/rode_tests'
   */
  it('should connect to a mongodb instance', done => {
    mongo.connect()
      .then(connection => {
        expect(mongo.isOpen).to.be(true);
        expect(connection).to.be.an(Object);
        expect(connection.host).to.be('localhost');
        expect(connection.name).to.be('rode_tests');
      })
      .catch(err => expect().fail(err))
      .done(done);
  });

  /**
   * Test if the existent mongodb instance can be closed
   */
  it('should close the mongodb instance', () => {
    mongo.close();
    expect(mongo.isOpen).to.be(false);
  });

});