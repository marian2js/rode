var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');
var os = require('os');
import { Package } from '../Package/Package';
import { FileExistsError } from '../Error/FileExistsError';
import { Template } from '../Util/Template';

export class PackageGenerator {

  /**
   * @param {Package} _package
   * @param {string} viewsPath
   * @param {string} filesPath
   */
  constructor (_package, viewsPath, filesPath) {
    this.package = _package;
    this.viewsPath = viewsPath;
    this.filesPath = filesPath;
  }

  /**
   * Create a new package
   *
   * @throws FileExistsError
   */
  create() {
    if (!this.force && this.package.existsSync()) {
      throw new FileExistsError(`Package: "${this.package.name}"`);
    }
    this.createController();
    this.createModel();
    this.createRoutes();
    this.createViews(this.viewEngine, this.addLayout);
  }

  /**
   * Create a new controller
   *
   * @param {string} [name]
   * @throws FileExistsError
   */
  createController(name = this.package.name) {
    var template = new Template(this._getTemplate('package/controller'));
    var testTemplate = new Template(this._getTemplate('package/tests/controller'));
    var templateVars = this._defaultTemplateVars;

    // avoid *ControllerController in the name of the controller
    if (name.toLowerCase().endsWith('controller')) {
      name = name.slice(0, -10);
    }

    if (!this.force && this.package.existsSync(`Controller/${name}Controller.js`)) {
      throw new FileExistsError(`Controller "${name}"`);
    }
    templateVars.controller = new Template.ExtendString(name);

    // soy's view engine needs a template on controller action
    if (this.viewEngine === 'soy') {
      templateVars.templateAction = `template: 'index',${os.EOL}      `;
    }

    this._write(`Controller/${name}Controller.js`, template.render(templateVars));
    this._write(`Tests/Controller/${name}ControllerTest.js`, testTemplate.render(templateVars));

    // if REST api is set create the RestController
    if (this.addRest) {
      this.createRestController();
    }
  }

  /**
   * Create a new REST controller
   *
   * @throws FileExistsError
   */
  createRestController() {
    var template = new Template(this._getTemplate('package/restcontroller'));
    var testTemplate = new Template(this._getTemplate('package/tests/restcontroller'));
    var templateVars = this._defaultTemplateVars;
    if (!this.force && this.package.existsSync('Controller/RestController.js')) {
      throw new FileExistsError('Controller "RestController"');
    }
    this._write(`Controller/RestController.js`, template.render(templateVars));
    this._write(`Tests/Controller/RestControllerTest.js`, testTemplate.render(templateVars));
  }

  /**
   * Create a new model
   *
   * @param {string} [name]
   * @throws FileExistsError
   */
  createModel(name = this.package.name) {
    var template = new Template(this._getTemplate('package/model'));
    var testTemplate = new Template(this._getTemplate('package/tests/model'));
    var templateVars = this._defaultTemplateVars;
    if (!this.force && this.package.existsSync(`Model/${name}.js`)) {
      throw new FileExistsError(`Model "${name}"`);
    }
    templateVars.model = new Template.ExtendString(name);
    this._write(`Model/${name}.js`, template.render(templateVars));
    this._write(`Tests/Model/${name}Test.js`, testTemplate.render(templateVars));
  }

  /**
   * Create a new routes file
   *
   * @throws FileExistsError
   */
  createRoutes() {
    var template = new Template(this._getTemplate('package/routes'));
    var templateVars = this._defaultTemplateVars;
    if (!this.force && this.package.existsSync('routes.js')) {
      throw new FileExistsError('"routes.js"');
    }
    templateVars.restApi = `${os.EOL}router.restApi = '/api/${this.package.name.toLowerCase()}';`;
    this._write('routes.js', template.render(templateVars));
  }

  /**
   * Create the views for the package
   *
   * @param {string} [engine] (jade|ejs|hjs|soy)
   * @param {boolean} [layout] if true, also create the layout
   */
  createViews(engine = 'jade', layout = false) {
    var templateVars = this._defaultTemplateVars;
    var viewsPath = path.join(this.viewsPath, this.package.name);
    var templateIndex;
    var templateLayout;

    // Generate the files according the view engine
    switch (engine) {
      case 'jade':
        templateIndex = new Template(this._getTemplate('views/index.jade'));
        this._write(path.join(viewsPath, 'index.jade'), templateIndex.render(templateVars));
        if (layout) {
          templateLayout = new Template(this._getTemplate('views/layout.jade'));
          this._write(path.join(this.viewsPath, 'layout.jade'), templateLayout.render(templateVars));
        }
        break;
      case 'ejs':
        templateIndex = new Template(this._getTemplate('views/index.ejs'));
        this._write(path.join(viewsPath, 'index.ejs'), templateIndex.render(templateVars));
        if (layout) {
          templateLayout = new Template(this._getTemplate('views/layout.ejs'));
          this._write(path.join(this.viewsPath, 'layout.ejs'), templateLayout.render(templateVars));
        }
        break;
      case 'hjs':
        // do not render vars in .hjs templates
        templateIndex = this._getTemplate('views/index.hjs');
        this._write(path.join(viewsPath, 'index.hjs'), templateIndex);
        break;
      case 'soy':
        templateIndex = new Template(this._getTemplate('views/index.soy'));
        this._write(path.join(viewsPath, 'index.soy'), templateIndex.render(templateVars));
        break;
      default:
        throw new Error(`View engine "${engine}" not yet supported.`);
    }
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
      package: new Template.ExtendString(this.package.name)
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

}