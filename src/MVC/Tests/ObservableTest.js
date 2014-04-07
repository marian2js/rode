var expect = require('expect.js');
import { Observable } from '../Observable';

describe('Observable', () => {
  var eventKey = 'event';
  var observable;

  beforeEach(function () {
    observable = new Observable();
  });

  /**
   * Add listeners
   */
  describe('on', () => {

    /**
     * Test if an event listener is registered
     */
    it('should register an event listener', () => {
      observable.on(eventKey, val => console.log);
      expect(observable.listenerCount(eventKey)).to.be(1);
    });

    /**
     * Test if multiple events are registered
     */
    it('should register multiple listeners for an event', () => {
      observable.on(eventKey, val => console.log);
      observable.on(eventKey, val => console.info);
      observable.on(eventKey, val => console.warn);
      expect(observable.listenerCount(eventKey)).to.be(3);
    });

  });

  /**
   * Remove listeners
   */
  describe('off', () => {

    /**
     * Test if an event listener is removed
     */
    it('should remove a specific listener of an event', () => {
      var callback = function () {};
      observable.on(eventKey, callback);
      observable.off(eventKey, callback);
      expect(observable.listenerCount(eventKey)).to.be(0);
    });

    /**
     * Test if all the event listeners are removed
     */
    it('should remove all the listeners of an event', () => {
      observable.on(eventKey, console.log);
      observable.on(eventKey, console.info);
      observable.on(eventKey, console.warn);
      observable.off(eventKey);
      expect(observable.listenerCount(eventKey)).to.be(0);
    });

  });

  /**
   * Trigger events
   */
  describe('trigger', () => {

    /**
     * Test if a listener is triggered
     */
    it('should trigger an event', () => {
      var called = false;
      observable.on(eventKey, () => called = true);
      observable.trigger(eventKey);
      expect(called).to.be(true);
    });

    /**
     * Test if a listener is triggered, and receive all the parameters
     */
    it('should trigger an event with multiple parameters', () => {
      var called = false;
      observable.on(eventKey, (val1, val2, val3) => {
        expect(val1).to.be('value 1');
        expect(val2).to.be('value 2');
        expect(val3).to.be('value 3');
        called = true;
      });
      observable.trigger(eventKey, 'value 1', 'value 2', 'value 3');
      expect(called).to.be(true);
    });

    /**
     * Test if a listener is triggered multiple times
     */
    it('should call the listener function once per event triggered', () => {
      var called = 0;
      observable.on(eventKey, () => called++);
      observable.trigger(eventKey);
      observable.trigger(eventKey);
      observable.trigger(eventKey);
      expect(called).to.be(3);
    });

    /**
     * Test if a listener registered with "once" only is triggered once
     */
    it('should trigger an event once', () => {
      var called = 0;
      observable.once(eventKey, val => called++);
      observable.trigger(eventKey);
      observable.trigger(eventKey);
      observable.trigger(eventKey);
      expect(called).to.be(1);
    });

    /**
     * Test if listeners without events throw an error
     */
    it('should not throw an error if there are no listeners for an event', () => {
      expect(() => observable.trigger(eventKey)).to.not.throwError();
    });

  });

  /**
   * Test if has static isObservable equals to true
   */
  it('should be observable', () => {
    expect(Observable.isObservable).to.be(true);
  });

  /**
   * Test isolation between multiple instances
   */
  it('should be executed isolated from other instances', () => {
    var observable2 = new Observable();
    var called = 0;
    var called2 = 0;
    observable.on(eventKey, () => called++);
    observable2.on(eventKey, () => called2++);
    observable.trigger(eventKey);
    observable.trigger(eventKey);
    observable.trigger(eventKey);
    observable2.trigger(eventKey);
    expect(called).to.be(3);
    expect(called2).to.be(1);
  });
});