var expect = require('expect.js');
var path = require('path');
var fs = require('extfs');
import { PackageGenerator } from '../PackageGenerator';
import { Package } from '../../Package/Package';

describe('PackageGenerator', () => {

  describe('Generate Components', () => {
    var packageName = 'FakePackage';
    var packagePath = path.join(__rodeBase, `tmp/${packageName}`);
    var viewsPath = path.join(__rodeBase, 'tmp/views/');
    var filesPath = path.join(__rodeBase, 'bin/files');
    var _package;
    var packageGenerator;

    /**
     * Creates a new Package and PackageGenerator
     */
    beforeEach(() => {
      _package = new Package(packageName, packagePath);
      packageGenerator = new PackageGenerator(_package, viewsPath, filesPath);
    });

    /**
     * Removes the content of the temporal folder
     */
    afterEach(() => {
      if (fs.existsSync(packagePath)) {
        fs.removeSync(packagePath);
      }
      if (fs.existsSync(viewsPath)) {
        fs.removeSync(viewsPath);
      }
    });

    /**
     * Test if the files of a new controller are created correctly
     */
    it('should generate a new controller', () => {
      var controllerName = 'fakeController';
      packageGenerator.createController(controllerName);
      expect(fs.existsSync(_package.path)).to.be(true);
      expect(fs.existsSync(_package.getPath(`Controller/${controllerName}.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Tests/Controller/${controllerName}Test.js`))).to.be(true);
    });

    /**
     * Test if the files of a new REST controller are created correctly
     */
    it('should generate a new REST controller', () => {
      packageGenerator.createRestController();
      expect(fs.existsSync(_package.path)).to.be(true);
      expect(fs.existsSync(_package.getPath(`Controller/RestController.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Tests/Controller/RestControllerTest.js`))).to.be(true);
    });

    /**
     * Test if the files of a new model are created correctly
     */
    it('should generate a new model', () => {
      var modelName = 'fake';
      packageGenerator.createModel(modelName);
      expect(fs.existsSync(_package.path)).to.be(true);
      expect(fs.existsSync(_package.getPath(`Model/${modelName}.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Tests/Model/${modelName}Test.js`))).to.be(true);
    });

    /**
     * Test if the routes file is created correctly
     */
    it('should generate the routes file', () => {
      packageGenerator.createRoutes();
      expect(fs.existsSync(_package.path)).to.be(true);
    });

    /**
     * Test if the jade views are created correctly
     */
    it('should generate the "jade" views', () => {
      packageGenerator.createViews('jade');
      expect(fs.existsSync(path.join(viewsPath, `${_package.name}/index.jade`))).to.be(true);
    });

    /**
     * Test if the jade layout is created correctly
     */
    it('should generate the "jade" layout', () => {
      packageGenerator.createViews('jade', true);
      expect(fs.existsSync(path.join(viewsPath, `layout.jade`))).to.be(true);
    });

    /**
     * Test if the ejs views are created correctly
     */
    it('should generate the "ejs" views', () => {
      packageGenerator.createViews('ejs');
      expect(fs.existsSync(path.join(viewsPath, `${_package.name}/index.ejs`))).to.be(true);
    });

    /**
     * Test if the ejs layout is created correctly
     */
    it('should generate the "ejs" layout', () => {
      packageGenerator.createViews('ejs', true);
      expect(fs.existsSync(path.join(viewsPath, `layout.ejs`))).to.be(true);
    });

    /**
     * Test if the hjs views are created correctly
     */
    it('should generate the "hjs" views', () => {
      packageGenerator.createViews('hjs');
      expect(fs.existsSync(path.join(viewsPath, `${_package.name}/index.hjs`))).to.be(true);
    });

    /**
     * Test if the soy views are created correctly
     */
    it('should generate the "soy" views', () => {
      packageGenerator.createViews('soy');
      expect(fs.existsSync(path.join(viewsPath, `${_package.name}/index.soy`))).to.be(true);
    });

    /**
     * Test if the files of a new package are created correctly
     */
    it('should create a package files', () => {
      packageGenerator.create();
      expect(fs.existsSync(_package.path)).to.be(true);
      expect(fs.existsSync(_package.getPath(`Controller/${_package.name}Controller.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Model/${_package.name}.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Tests/Controller/${_package.name}ControllerTest.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`Tests/Model/${_package.name}Test.js`))).to.be(true);
      expect(fs.existsSync(_package.getPath(`routes.js`))).to.be(true);

      // by default the views use "jade" as their view engine
      expect(fs.existsSync(path.join(viewsPath, `${_package.name}/index.jade`))).to.be(true);
    });

  });

});