var EventEmitter = require('events').EventEmitter;

export class Observable {

  constructor() {
    this.__events__ = new EventEmitter;
  }

  /**
   * Execute each of the listeners in order with the supplied arguments
   *
   * @returns {Observable}
   */
  trigger() {
    this.__events__.emit(...arguments);
    return this;
  }

  /**
   * Alias for trigger
   *
   * @returns {Observable}
   */
  emit() {
    return this.trigger(...arguments);
  }

  /**
   * Adds a listener to the end of the listeners array for the specified event
   *
   * @param {string} event
   * @param {Function} listener
   * @returns {Observable}
   */
  on(event, listener) {
    this.__events__.on(event, listener);
    return this;
  }

  /**
   * Remove a listener from the listener array for the specified event
   *
   * @param {string} [event]
   * @param {Function} [listener]
   * @returns {Observable}
   */
  off(event, listener) {
    if (!listener) {
      return this.removeAllListeners(event);
    }
    this.__events__.removeListener(event, listener);
    return this;
  }

  /**
   * Adds a one time listener for the event
   *
   * @returns {Observable}
   */
  once() {
    this.__events__.once(...arguments);
    return this;
  }

  /**
   * Removes all listeners, or those of the specified event
   *
   * @param {string} [event]
   * @returns {Observable}
   */
  removeAllListeners(event) {
    this.__events__.removeAllListeners(event);
    return this;
  }

  /**
   * By default will print a warning if more than 10 listeners are added for a particular event
   * Set to zero for unlimited
   *
   * @param {number} n
   * @returns {Observable}
   */
  setMaxListeners(n) {
    this.__events__.setMaxListeners(n);
    return this;
  }

  /**
   * Returns an array of listeners for the specified event
   *
   * @param {string} event
   * @returns {Array}
   */
  listeners(event) {
    return this.__events__.listeners(event);
  }

  /**
   * Returns the number of listeners for the specified event
   *
   * @param {string} event
   * @returns {number}
   */
  listenerCount(event) {
    return EventEmitter.listenerCount(this.__events__, event);
  }

  /**
   * Returns if the class is observable
   *
   * @returns {boolean}
   */
  static get isObservable() {
    return true;
  }

}