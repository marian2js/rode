var path = require('path');
var fs = require('fs');

export class Package {

  constructor(name, packagePath) {
    this.name = name;
    this.path = packagePath;
  }

  /**
   * Returns the path of a file inside of this package
   *
   * @param [file]
   * @return {string}
   */
  getPath(file) {
    if (!file) {
      return this.path;
    }
    return path.join(this.path, file);
  }

  /**
   * Returns a controller by name
   *
   * @param {string} name
   * @return {exports}
   */
  getController(name = this.name) {
    var ctrlPath = this.getPath(`Controller/${name}Controller`);
    return require(ctrlPath)[`${name}Controller`];
  }

  /**
   * Returns the path of the routes file of the packages
   *
   * @return {string}
   */
  get routesPath() {
    return this.getPath('routes.js');
  }

  /**
   * Returns the router defined in the routes file
   *
   * @return {Router}
   */
  get router() {
    var router;
    try {
      router = require(this.routesPath).router;
      router.pack = this;
    } catch (e) { }
    return router;
  }

  /**
   * Check if the package exists
   *
   * @param {string} [resourcePath]
   * @return {Promise}
   */
  exists(resourcePath) {
    if (resourcePath) {
      resourcePath = path.join(this.path, resourcePath);
    } else {
      resourcePath = this.path;
    }
    return new Promise(resolve => fs.exists(resourcePath, resolve));
  }

  /**
   * Check if the package exists synchronously
   *
   * @param {string} [resourcePath]
   * @return {boolean}
   */
  existsSync(resourcePath) {
    if (resourcePath) {
      resourcePath = path.join(this.path, resourcePath);
    } else {
      resourcePath = this.path;
    }
    return fs.existsSync(resourcePath);
  }
}