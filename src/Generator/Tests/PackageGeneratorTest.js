var expect = require('expect.js');
var path = require('path');
var fs = require('extfs');
import { PackageGenerator } from '../PackageGenerator';
import { Package } from '../../Package/Package';
import { Router } from '../../Router/Router';

describe('PackageGenerator', () => {

  describe('Render Template', () => {

    /**
     * Test if the template system works correctly
     */
    it('should render the variables inside a template', () => {
      var template = 'Hello {{ name }}! This is a {{ thing | toLowerCase }}.';
      var vars = {
        name: 'World',
        thing: 'TEST'
      };
      template = PackageGenerator._renderTemplate(template, vars);
      expect(template).to.be('Hello World! This is a test.');
    });

    /**
     * Test if the template does not render undefined variables
     */
    it('should not render something if the variable does not exist', () => {
      var template = 'This {{ variable }} does not exist';
      template = PackageGenerator._renderTemplate(template, {});
      expect(template).to.be('This  does not exist');
    });

  });

  describe('Generate Components', () => {
    var packagePath = path.join(__rodeBase, 'tmp/FakePackage');
    var filesPath = path.join(__rodeBase, 'bin/files');
    var _package;
    var packageGenerator;

    /**
     * Creates a new Package and PackageGenerator
     */
    beforeEach(() => {
      _package = new Package('FakePackage', packagePath);
      packageGenerator = new PackageGenerator(_package, filesPath);
    });

    /**
     * Removes the content of the temporal folder
     */
    afterEach(() => {
      if (fs.existsSync(packagePath)) {
        fs.removeSync(packagePath);
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
    });

  });

});