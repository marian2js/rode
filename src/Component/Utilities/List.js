var _ = require('underscore');
var rode = require('../../../rode');

/**
 * Creates a clone of Array
 *
 * @returns {Array}
 * @constructor
 */
function List() {
    var list = [];
    list.__proto__ = List.prototype;
    return list;
}
List.prototype = [];

/**
 * rode.List
 *
 * Create a subclass of Array.prototype
 */
_.extend(List.prototype, rode.Object.extend(), {

    /**
     * Returns an element by position
     *
     * @param index
     * @returns {*}
     */
    get: function (index) {
        return this[index];
    },

    /**
     * Set an element by position
     *
     * @param index
     * @param value
     * @returns {List}
     */
    set: function (index, value) {
        this[index] = value;
        return this;
    },

    /**
     * Check if an element is in the list
     *
     * @param element
     * @returns {boolean}
     */
    contains: function (element) {
        for (var i = 0, len = this.length; i < len; i++) {
            if (element === this[i]) {
                return true;
            }
        }
        return false;
    },

    /**
     * Add elements to the list
     *
     * @param elements
     * @returns {List}
     */
    add: function (elements) {
        if (!_.isArray(elements)) {
            elements = [ elements ];
        }
        elements.forEach(function (e) {
            this.push(e);
        }.bind(this));
        return this;
    },

    /**
     * Check if the list contains no elements
     *
     * @returns {boolean}
     */
    isEmpty: function () {
        return !this.length;
    },

    /**
     * Check if two lists are equals
     *
     * @param list
     * @returns {boolean}
     */
    equals: function (list) {
        if (this.length !== list.length) {
            return false;
        }
        for (var i = 0; i < this.length; i++) {
            if (this[i] !== list[i]) {
                return false;
            }
        }
        return true;
    },

    clone: function () {
        var list = new rode.List;
        return list.add(this);
    },

    /**
     * Removes an element by position
     *
     * @param index
     * @returns {boolean}
     */
    remove: function (index) {
        if (~index) {
            this.splice(index, 1);
            return true;
        }
        return false;
    },

    /**
     * Removes a specified element
     *
     * @param element
     * @returns {boolean}
     */
    removeElement: function (element) {
        return this.remove(this.indexOf(element));
    },

    /**
     * Remove all the elements in another collection
     *
     * @param list
     * @returns {boolean}
     */
    removeAll: function (list) {
        var result = false;
        list.forEach(function (e) {
            result |= this.removeElement(e);
        }.bind(this));
        return result;
    },

    /**
     * Replace all the elements of the list
     *
     * @param list
     */
    replaceAll: function (list) {
        this.clear();
        this.add(list);
    },

    /**
     * Remove all the elements in the list
     */
    clear: function () {
        this.length = 0;
    },

    /**
     * Return a new array with all the elements in the same order
     *
     * @returns {Array}
     */
    toArray: function () {
        var arr = [];
        this.forEach(function (e) {
            arr.push(e);
        });
        return arr;
    },

    /**
     * Returns the first element of the list
     *
     * @param [n]
     * @returns {*}
     */
    first: function (n) {
        return _.first(this, n);
    },

    /**
     * Returns everything but the last entry of the list
     *
     * @param [n]
     * @returns {List}
     */
    initial: function (n) {
        var list = new rode.List;
        return list.add(_.initial(this, n));
    },

    /**
     * Returns the last element of the list
     *
     * @param [n]
     * @returns {*}
     */
    last: function (n) {
        return _.last(this, n);
    },

    /**
     * Returns the rest of the elements in the list
     *
     * @param index
     * @returns {*}
     */
    rest: function (index) {
        var list = new rode.List;
        return list.add(_.rest(this, index));
    },

    /**
     * Returns a new list with the false values removed
     *
     * @returns {List}
     */
    compact: function () {
        var list = new rode.List;
        return list.add(_.compact(this));
    },

    /**
     * Returns a new list flattened
     *
     * @returns {List}
     */
    flatten: function () {
        var list = new rode.List;
        return list.add(_.flatten(this));
    },

    /**
     * Returns a new list without the specified values
     *
     * @returns {List}
     */
    without: function () {
        var list = new rode.List;
        return list.add(_.without.apply(this, thisToArgs(this, arguments)));
    },

    /**
     * Split the list into two arrays
     *
     * @param predicate
     * @returns {Array}
     */
    partition: function (predicate) {
        var lists = [];
        var arrays = _.partition(this, predicate);
        arrays.forEach(function (arr) {
            var list = new rode.List;
            lists.push(list.add(arr));
        });
        return lists;
    },

    /**
     * Returns the list joined with the arrays specified, the join is unique
     *
     * @returns {List}
     */
    union: function () {
        var list = new rode.List;
        return list.add(_.union.apply(this, thisToArgs(this, arguments)));
    },

    /**
     * Returns the list intercepted with the arrays specified, the intersection is unique
     *
     * @returns {List}
     */
    intersection: function () {
        var list = new rode.List;
        return list.add(_.intersection.apply(this, thisToArgs(this, arguments)));
    },

    /**
     * Returns the list minus the arrays specified, the difference is unique
     *
     * @returns {List}
     */
    difference: function () {
        var list = new rode.List;
        return list.add(_.difference.apply(this, thisToArgs(this, arguments)));
    },

    /**
     * Returns a list with the duplicated values removed
     *
     * @param {boolean} isSorted
     * @param iterator
     * @returns {List}
     */
    unique: function (isSorted, iterator) {
        var list = new rode.List;
        return list.add(_.uniq(this, isSorted, iterator));
    },

    /**
     * Alias for unique
     *
     * @param {boolean} isSorted
     * @param iterator
     * @returns {List}
     */
    uniq: function (isSorted, iterator) {
        return this.unique(isSorted, iterator);
    },

    /**
     *
     * @returns {List}
     */
    zip: function () {
        var list = new rode.List;
        return list.add(_.zip.apply(this, thisToArgs(this, arguments)));
    },

    /**
     *
     * @param values
     * @returns {List}
     */
    object: function (values) {
        var list = new rode.List;
        return list.add(_.object(this, values));
    },

    /**
     * Returns the index at which the value should be inserted into the list
     *
     * @param value
     * @param iterator
     * @param context
     * @returns {Number}
     */
    sortedIndex: function (value, iterator, context) {
        return _.sortedIndex(this, value, iterator, context);
    },

    /**
     * alias for forEach
     *
     * @returns {forEach}
     */
    each: function () {
        return this.forEach.apply(this, arguments);
    },

    /**
     * Returns a new list with each value mapped through a transformation
     *
     * @param iterator
     * @param context
     * @returns {List}
     */
    map: function (iterator, context) {
        var list = new rode.List;
        return list.add(_.map(this, iterator, context));
    },

    /**
     *
     * @param iterator
     * @param memo
     * @param context
     * @returns {*}
     */
    reduce: function (iterator, memo, context) {
        return _.reduce(this, iterator, memo, context);
    },

    /**
     *
     * @param iterator
     * @param memo
     * @param context
     * @returns {*}
     */
    reduceRight: function (iterator, memo, context) {
        return _.reduceRight(this, iterator, memo, context);
    },

    /**
     * Returns a new list with the occurrences that passes the test
     *
     * @param predicate
     * @param context
     * @returns {List}
     */
    find: function (predicate, context) {
        var list = new rode.List;
        return list.add(_.filter(this, predicate, context));
    },

    /**
     * Returns the first occurrence that passes the test
     *
     * @param predicate
     * @param context
     * @returns {*}
     */
    findOne: function (predicate, context) {
        return _.find(this, predicate, context);
    },

    /**
     *
     * @param properties
     * @returns {*}
     */
    where: function (properties) {
        return _.where(this, properties);
    },

    /**
     *
     * @param properties
     * @returns {*}
     */
    findWhere: function (properties) {
        return _.findWhere(this, properties);
    },

    /**
     *
     * @param predicate
     * @param context
     * @returns {List}
     */
    reject: function (predicate, context) {
        var list = new rode.List;
        return list.add(_.reject(this, predicate, context));
    },

    /**
     * Returns true if all of the values in the list pass the predicate truth test
     *
     * @param predicate
     * @param context
     * @returns {Boolean}
     */
    every: function (predicate, context) {
        return _.every(this, predicate, context);
    },

    /**
     * Returns true if any of the values in the list pass the predicate truth test
     *
     * @param predicate
     * @param context
     * @returns {Boolean}
     */
    some: function (predicate, context) {
        return _.some(this, predicate, context);
    },

    /**
     *
     * @param methodName
     * @returns {List}
     */
    invoke: function (methodName) {
        var list = new rode.List;
        return list.add(_.invoke.apply(this, thisToArgs(this, arguments)));
    },

    /**
     *
     * @param propertyName
     * @returns {*}
     */
    pluck: function (propertyName) {
        return _.pluck(this, propertyName);
    },

    /**
     * Returns the maximum value in list
     *
     * @param iterator
     * @param context
     * @returns {*}
     */
    max: function (iterator, context) {
        return _.max(this, iterator, context);
    },

    /**
     * Returns the minimum value in list
     *
     * @param iterator
     * @param context
     * @returns {*}
     */
    min: function (iterator, context) {
        return _.min(this, iterator, context);
    },

    /**
     * Returns a new list with the values sorted
     *
     * @param iterator
     * @param context
     * @returns {List}
     */
    sortBy: function (iterator, context) {
        var list = new rode.List;
        return list.add(_.sortBy(this, iterator, context));
    },

    /**
     *
     * @param iterator
     * @param context
     * @returns {*}
     */
    groupBy: function (iterator, context) {
        return _.groupBy(this, iterator, context);
    },

    /**
     *
     * @param iterator
     * @param context
     * @returns {*}
     */
    indexBy: function (iterator, context) {
        return _.indexBy(this, iterator, context);
    },

    /**
     *
     * @param iterator
     * @param context
     * @returns {*}
     */
    countBy: function (iterator, context) {
        return _.countBy(this, iterator, context);
    },

    /**
     * Returns a shuffled copy of the list, using a version of the Fisher-Yates shuffle
     *
     * @link http://en.wikipedia.org/wiki/Fisher–Yates_shuffle
     * @returns {List}
     */
    shuffle: function () {
        var list = new rode.List;
        return list.add(_.shuffle(this));
    },

    /**
     * Returns a random sample from the list.
     *
     * @param n
     * @returns {*}
     */
    sample: function (n) {
        return _.sample(this, n);
    },

    /**
     * Returns the length of the list
     *
     * @returns {Number}
     */
    size: function () {
        return this.length;
    }
});

/**
 * Helper to use Function.prototype.call and prepend this to arguments
 *
 * @param that
 * @param args
 * @returns {Array}
 */
function thisToArgs(that, args) {
    args = Array.prototype.slice.call(args, 0);
    args.unshift(that);
    return args;
}

module.exports = List;