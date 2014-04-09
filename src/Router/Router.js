var path = require('path');
var _ = require('underscore');
var S = require('string');
import { List } from '../Util/List';
import { InvalidParamsError } from '../Error/InvalidParamsError';

export class Router {

  constructor() {
    this.routes = new List;
  }

  /**
   * Add a new route to the router
   *
   * @param route
   * @return {Router}
   * @throws InvalidParamsError
   */
  add(route) {
    if (!route.action) {
      throw new InvalidParamsError('Route requires an action');
    }

    // default parameters
    route = _.defaults(route, {
      pattern: '',
      method: 'get'
    });

    this.routes.add(route);
    return this;
  }

  /**
   * Find all the routes that match a predicate
   *
   * @param {Function} predicate
   * @return {List}
   */
  filter(predicate) {
    return this.routes.filter(predicate);
  }

  /**
   * Find all the routes by action
   *
   * @param {string} action
   * @return {List}
   */
  filterByAction(action) {
    return this.filter(route => action === route.action);
  }

  /**
   * Find all the routes by pattern
   *
   * @param {string} pattern
   * @return {List}
   */
  filterByPattern(pattern) {
    return this.filter(route => pattern === route.pattern);
  }

  /**
   * Find the first route that match a predicate
   *
   * @param {Function} predicate
   * @return {*}
   */
  find(predicate) {
    return this.routes.find(predicate);
  }

  /**
   * Find the first route that match an action
   *
   * @param {string} action
   * @return {*}
   */
  findByAction(action) {
    return this.find(route => action === route.action);
  }

  /**
   * Find the first route that match a pattern
   *
   * @param {string} pattern
   * @return {*}
   */
  findByPattern(pattern) {
    return this.find(route => pattern === route.pattern);
  }

  /**
   * Remove all the routes that match the predicate
   *
   * @param {Function} predicate
   */
  remove(predicate) {
    var removes = this.filter(predicate);
    removes.forEach(route => this.routes.removeElement(route));
  }

  /**
   * Remove the first route that match the predicate
   *
   * @param {Function} predicate
   */
  removeOne(predicate) {
    var remove = this.find(predicate);
    this.routes.removeElement(remove);
  }

  /**
   * Iterate normal and rest routes and invoke `fn(el, i)`
   *
   * @param {Function} callback
   * @return {*}
   */
  forEach(callback) {
    return this.getAll().forEach(callback);
  }

  /**
   * Returns a route by index
   *
   * @param {number} index
   * @return {*}
   */
  get(index) {
    return this.routes[index];
  }

  /**
   * Returns all the routes
   *
   * @returns {List}
   */
  getAll() {
    var list = new List;
    list.add(this.routes);
    list.add(this.restRoutes);
    return list;
  }

  /**
   * Transform the REST method name to an url
   *
   * @param {Array} parts
   * @returns {string}
   */
  static transformRestRoute(parts) {
    var routePath = '',
        ids = 0;
    if (!_.isArray(parts)) {
      return '';
    }
    parts.forEach(part => {
      if (part === 'Byid') {
        routePath += ++ids > 1 ? `:id${ids}/` : ':id/';
      } else {
        routePath += `${part}/`;
      }
    });
    return routePath;
  }

  /**
   * Returns the list of REST routes
   *
   * @return {Array}
   */
  get restRoutes() {
    if (!this.isRestful) {
      return [];
    }

    var controllerName = this.restController || 'Rest';
    var controller = this.pack.getController(controllerName);
    var routes = [],
        routePath,
        method,
        parts;

    // loop over each action
    for (var action in controller.prototype) {
      method = action.match(/[a-z]+/)[0];
      parts = S(action).replaceAll('ById','Byid').s.match(/[A-Z][a-z]+/g);
      routePath = Router.transformRestRoute(parts);
      if (routePath.endsWith('/')) {
        routePath = routePath.substring(0, routePath.length - 1);
      }
      routes.push({
        controller: controllerName,
        pattern: routePath,
        action: action,
        method: method,
        isRestful: true
      });
    }

    return routes;
  }

  /**
   * Returns the package name
   *
   * @return {string}
   */
  get name() {
    return this.pack.name;
  }

  /**
   * Returns the number of routes
   *
   * @return {number}
   */
  get length() {
    return this.routes.length;
  }

  /**
   * Returns if the route is restful
   *
   * @return {boolean}
   */
  get isRestful() {
    return !!this.restApi;
  }
}
