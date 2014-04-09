var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var S = require('string');
import { Package } from '../Package/Package';

export class PackageGenerator {

  /**
   * @param {Package} _package
   * @param {string} filesPath
   */
  constructor (_package, filesPath) {
    this.package = _package;
    this.filesPath = filesPath;
  }

  /**
   * Create a new package
   */
  create() {
    this.createController();
    this.createModel();
    this.createRoutes();
  }

  /**
   * Create a new controller
   *
   * @param {string} [name]
   */
  createController(name = this.package.name) {
    var template = this._getTemplate('package/controller');
    var testTemplate = this._getTemplate('package/tests/controller');
    var templateVars = this._defaultTemplateVars;

    // avoid *ControllerController in the name of the controller
    if (name.toLowerCase().endsWith('controller')) {
      name = name.slice(0, -10);
    }

    templateVars.controller = new PackageGenerator._templateVar(name);
    this._write(`Controller/${name}Controller.js`, PackageGenerator._renderTemplate(template, templateVars));
    this._write(`Tests/Controller/${name}ControllerTest.js`, PackageGenerator._renderTemplate(testTemplate, templateVars));
  }

  /**
   * Create a new model
   *
   * @param {string} [name]
   */
  createModel(name = this.package.name) {
    var template = this._getTemplate('package/model');
    var testTemplate = this._getTemplate('package/tests/model');
    var templateVars = this._defaultTemplateVars;
    templateVars.model = new PackageGenerator._templateVar(name);
    this._write(`Model/${name}.js`, PackageGenerator._renderTemplate(template, templateVars));
    this._write(`Tests/Model/${name}Test.js`, PackageGenerator._renderTemplate(testTemplate, templateVars));
  }

  /**
   * Create a new routes file
   */
  createRoutes() {
    var template = this._getTemplate('package/routes');
    var templateVars = this._defaultTemplateVars;
    this._write('routes.js', PackageGenerator._renderTemplate(template, templateVars));
  }

  /**
   * Create a file inside the package
   *
   * @param {string} filePath
   * @param {string} str
   */
  _write(filePath, str) {
    if (!filePath.startsWith('/')) {
      filePath = path.join(this.package.path, filePath);
    }
    this._mkdir(path.dirname(filePath));
    fs.writeFile(filePath, str);
    console.log(`  \x1b[36mcreated\x1b[0m : ${filePath}`);
  }

  /**
   * Create a directory inside the package
   *
   * @param dirPath
   * @private
   */
  _mkdir(dirPath) {
    if (!dirPath.startsWith('/')) {
      dirPath = path.join(this.package.path, dirPath);
    }
    mkdirp.sync(dirPath, '0755');
  }

  /**
   * Returns the default variables for the templates
   *
   * @private
   */
  get _defaultTemplateVars() {
    return {
      package: this.package.name
    }
  }

  /**
   * Returns the content of a template file
   *
   * @param {string} relativePath
   * @return {string}
   * @private
   */
  _getTemplate(relativePath) {
    return fs.readFileSync(path.join(this.filesPath, `${relativePath}.template`))
      .toString();
  }

  /**
   * Render the variables between double curly braces
   *
   * i.e: {{ name }} -> vars['name']
   *      {{ name | toLowerCase }} -> vars['name'].toLowerCase()
   *
   * @param {string} template
   * @param vars
   * @returns {string}
   * @private
   */
  static _renderTemplate(template, vars) {
    var regex = /\{{2}([^}]+)\}{2}/g;
    template = template.replace(regex, (match, value) => {
      var parts = value.split('|');
      var result;
      value = parts[0].trim();
      result = vars[value] || '';
      if (parts[1] && parts[1].trim()) {
        result = result[parts[1].trim()]();
      }
      return result;
    });
    return template;
  }

  /**
   * Helper for extend strings in templates
   *
   * @param {string} _str
   * @private
   */
  static _templateVar(_str) {
    var str = _str;

    /**
     * Returns the string with the first letter in upper cases
     *
     * @return {string}
     */
    this.capitalize = function () {
      return str[0].toUpperCase() + str.slice(1);
    };

    /**
     * Returns the string with the first letter in lower cases
     *
     * @return {string}
     */
    this.camelize = function () {
      return str[0].toLowerCase() + str.slice(1);
    };

    /**
     * Returns the string
     *
     * @return {string}
     */
    this.toString = function () {
      return str;
    };

    return this;
  }
}