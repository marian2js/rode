var fs = require('fs');
var path = require('path');
var _ = require('underscore');

export class Config {

  constructor(rootPath, env = false) {
    var configPath = path.join(rootPath, 'config');
    var file = `${configPath}/config.json`;
    this.options = {};
    this._loadFile(file);

    // load environment config
    if (env) {
      var envFile = `${configPath}/${env}.json`;
      this._loadFile(envFile);
    }
  }

  /**
   * Extend the current configuration with a new json file
   *
   * @param {string} file
   * @private
   */
  _loadFile(file) {
    var json;
    try {
      json = fs.readFileSync(file);
      json = JSON.parse(json);
    } catch(e) {
      console.error(`${file} does not exists.`);
      json = {};
    }
    _.extend(this.options, json);
  }

  /**
   * Returns an option value
   *
   * @param {string} key
   * @return {*}
   */
  get(key) {
    return this.options[key];
  }

  /**
   * Set an option value
   *
   * @param {string} key
   * @param value
   */
  set(key, value) {
    this.options[key] = value;
  }

  /**
   * Check if options has a key
   *
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return !!this.options[key];
  }

  /**
   * Remove an option key
   *
   * @param {string} key
   */
  remove(key) {
    delete this.options[key];
  }

  /**
   * Remove all the options
   */
  clear() {
    this.options = {};
  }
}