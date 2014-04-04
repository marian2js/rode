var path = require('path');
var _ = require('underscore');
import { Config } from '../Config/Config';
import { Server } from '../Server/Server';
import { InvalidParameterError } from '../Error/InvalidParameterError';

export class Core {

  constructor(rootPath, env = process.env.NODE_ENV || 'development') {
    if (!rootPath) {
      throw new InvalidParameterError('[Core] Path is required!');
    }
    this.path = rootPath;
    this.env = env;
    this.options = new Config(this.path, this.env);
    this.server = new Server;
    Core.instance = this;
  }

  /**
   * Config express server before start the app
   *
   * @param {Function} callback
   */
  config(callback) {
    if (_.isFunction(callback)) {
      callback.call(this, this.server.app);
    } else {
      throw new InvalidParameterError('rode.config first parameter should be a function');
    }
  }

  /**
   * Run the app
   *
   * @returns {Promise}
   */
  run() {
    return this.packageList.getAll()
        .then(packs => {
          this.server.createRoutes(packs);
          this.server.config(this);
          return this.server.run();
        });
  }

  /**
   * Stop the app
   *
   * @returns {Promise}
   */
  stop() {
    return this.server.stop();
  }

  /**
   * Get path for a resource
   *
   * @param {string} name
   * @return {string}
   */
  getPath(name) {
    var statics = this.options.get('statics') || {};
    _.defaults(statics, {
      path: 'public',
      images: 'images',
      js: 'js',
      css: 'css'
    });

    var _path;
    switch (name.toLowerCase()) {
      case 'src':
        return path.join(this.path, this.options.get('srcPath') || 'src');

      case 'views':
        if (this.options.has('views')) {
          _path = this.options.get('views').path;
        }
        return path.join(this.path, _path || 'views');

      case 'statics': case 'public':
        return path.join(this.path, statics.path);

      case 'images':
        return path.join(this.path, path.join(statics.path, statics.images));

      case 'js': case 'javascript':
        return path.join(this.path, path.join(statics.path, statics.js));

      case 'css': case 'stylesheets':
        return path.join(this.path, path.join(statics.path, statics.css));

      default:
        return this.path;
    }
  }

  /**
   * Returns express app
   *
   * @return {*}
   */
  get app() {
    return this.server.app;
  }

  /**
   * Returns express
   *
   * @return {*}
   */
  get express() {
    return this.server.express;
  }

  /**
   * Return the last instance of this class
   *
   * @return {Core}
   */
  static get instance() {
    return this._instance;
  }

  /**
   * Set the last instance of this class
   *
   * @param {Core} instance
   */
  static set instance(instance) {
    this._instance = instance;
  }
}