var EventEmitter = require('events').EventEmitter;
var _ = require('underscore');

/**
 * Creates a new object instance
 *
 * @param {Object} [options]
 * @returns {rode.Object}
 * @constructor
 */
var obj = function (options) {
    var self;
    var events = new EventEmitter();

    // Extends this Object with the options passed as argument
    self = options ? _.extend(this, options) : this;

    // Call the initialize method of the new instances
    if (this.initialize && _.isFunction(this.initialize)) {
        this.initialize.apply(this, arguments);
    }

    return self;
};

/**
 * Based on Backbone.js 1.1.0 extend helper
 *
 * (c) 2010-2011 Jeremy Ashkenas, DocumentCloud Inc.
 * (c) 2011-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Backbone may be freely distributed under the MIT license.
 */
obj.extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            var _class = this._class ? this._class : child;
            return parent.apply(_.extend(this, { _class: _class, super: parent.prototype }), arguments);
        };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.super = parent.prototype;

    return child;
};

module.exports = obj.extend({

    /**
     * Execute each of the listeners in order with the supplied arguments
     *
     * @param event
     * @returns {*}
     */
    trigger: function (event) {
        this._getEvents().emit.apply(this, arguments);
        return this;
    },

    /**
     * Alias for trigger
     *
     * @param event
     * @returns {*}
     */
    emit: function (event) {
        this.trigger.apply(this, arguments);
        return this;
    },

    /**
     * Adds a listener to the end of the listeners array for the specified event
     *
     * @param event
     * @param {Function} callback
     * @returns {*}
     */
    on: function (event, callback) {
        this._getEvents().on.apply(this, arguments);
        return this;
    },

    /**
     * Remove a listener from the listener array for the specified event
     *
     * @param event
     * @param {Function} callback
     * @returns {*}
     */
    off: function (event, callback) {
        this._getEvents().removeListener.apply(this, arguments);
        return this;
    },

    /**
     * Adds a one time listener for the event
     *
     * @param event
     * @param {Function} callback
     * @returns {*}
     */
    once: function (event, callback) {
        this._getEvents().once.apply(this, arguments);
        return this;
    },

    /**
     * Removes all listeners, or those of the specified event
     *
     * @param event
     * @returns {*}
     */
    removeAllListeners: function (event) {
        this._getEvents().removeAllListeners.apply(this, arguments);
        return this;
    },

    /**
     * By default will print a warning if more than 10 listeners are added for a particular event
     * Set to zero for unlimited
     *
     * @param n
     * @returns {*}
     */
    setMaxListeners: function (n) {
        this._getEvents().setMaxListeners(n);
        return this;
    },

    /**
     * Returns a copy of this object
     *
     * @returns {rode.Object}
     */
    clone: function () {
        return new this._class(_.clone(this));
    },

    /**
     * Returns an EventEmitter for each instance
     *
     * @returns {EventEmitter}
     * @private
     */
    _getEvents: function () {
        if (!this._events) {
            this._events = new EventEmitter;
        }
        return this._events;
    }
});