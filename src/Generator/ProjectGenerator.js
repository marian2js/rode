var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
import { PackageGenerator } from './PackageGenerator';
import { Package } from '../Package/Package';
import { Template } from '../Util/Template';

export class ProjectGenerator {

  constructor(projectPath, filesPath, acceptedVersion) {
    this.projectPath = projectPath;
    this.filesPath = filesPath;
    this.acceptedVersion = acceptedVersion;
    var packagePath = path.join(projectPath, 'src/Main');
    var viewsPath = path.join(projectPath, 'views');
    this.mainPackage = new Package('Main', packagePath);
    this.packageGenerator = new PackageGenerator(this.mainPackage, viewsPath, filesPath);
  }

  /**
   * Creates a new project
   */
  create() {
    this.createMainFiles(this.sessions);
    this.createMainPackage();
    this.createConfigs(this.viewEngine, this.cssTemplate);
    this.createScripts();
    this.createStyles(this.cssTemplate);
    this.createPackageJSON(this.cssTemplate);
    this.createGruntFiles();
    this.createBowerFiles();
  }

  /**
   * Creates app.js and setup.js files
   */
  createMainFiles(sessions = false) {
    var appTemplate = new Template(this._getTemplate('app'));
    var templateVars = {
      sessions: sessions ? 'app.use(express.cookieParser(\'your secret here\'));' : ''
    };
    this._write('app.js', appTemplate.render(templateVars));
    this._write('setup.js', this._getTemplate('setup'));
  }

  /**
   * Creates the Main package
   */
  createMainPackage() {
    this.packageGenerator.viewEngine = this.viewEngine;
    this.packageGenerator.addLayout = true;
    this.packageGenerator.force = true;
    this.packageGenerator.create();
  }

  /**
   * Creates the configuration files
   *
   * @param {string} [viewEngine]
   * @param {string} [cssTemplate]
   */
  createConfigs(viewEngine = 'jade', cssTemplate = 'css') {
    var configTemplate = new Template(this._getTemplate('config/config'));
    var developmentTemplate = new Template(this._getTemplate('config/development'));
    var productionTemplate = new Template(this._getTemplate('config/production'));
    var testTemplate = new Template(this._getTemplate('config/test'));
    var templateVars = {
      cssTemplate: cssTemplate,
      viewEngine: viewEngine
    };
    this._write('config/config.json', configTemplate.render(templateVars));
    this._write('config/development.json', developmentTemplate.render(templateVars));
    this._write('config/production.json', productionTemplate.render(templateVars));
    this._write('config/test.json', testTemplate.render(templateVars));
  }

  /**
   * Creates the folder for scripts
   */
  createScripts() {
    this._mkdir('public/js');
  }

  /**
   * Creates the files for the styles
   *
   * @param {string} [cssTemplate]
   */
  createStyles(cssTemplate = 'css') {
    var styles = {
      css: 'css',
      less: 'less',
      stylus: 'styl'
    };
    if (!styles[cssTemplate]) {
      throw new Error(`Style "${cssTemplate}" not yet supported.`);
    }
    this._write(`public/css/style.${styles[cssTemplate]}`, this._getTemplate(`public/css/${cssTemplate}`));
  }

  /**
   * Creates the package.json file
   *
   * @param {string} [cssTemplate]
   */
  createPackageJSON(cssTemplate = 'css') {
    var packageTemplate = new Template(this._getTemplate('package'));
    var templateVars = {
      acceptedVersion: this.acceptedVersion,
      css: cssTemplate
    };
    this._write('package.json', packageTemplate.render(templateVars));
  }

  /**
   * Create the Gruntfile.js file
   */
  createGruntFiles() {
    this._write('Gruntfile.js', this._getTemplate('gruntfile'));
  }

  /**
   * Creates all the bower files
   */
  createBowerFiles() {
    this._write('bower.json', this._getTemplate('bower'));
    this._write('.bowerrc', this._getTemplate('bowerrc'));
  }

  /**
   * Creates a file inside the package
   *
   * @param {string} filePath
   * @param {string} str
   */
  _write(filePath, str) {
    if (!filePath.startsWith('/')) {
      filePath = path.join(this.projectPath, filePath);
    }
    this._mkdir(path.dirname(filePath));
    fs.writeFile(filePath, str);
    console.log(`  \x1b[36mcreated\x1b[0m : ${filePath}`);
  }

  /**
   * Creates a directory
   *
   * @param {string} dirPath
   * @private
   */
  _mkdir(dirPath) {
    if (!dirPath.startsWith('/')) {
      dirPath = path.join(this.projectPath, dirPath);
    }
    mkdirp.sync(dirPath, '0755');
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
