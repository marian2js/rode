var path = require('path');
var expect = require('expect.js');
import { Package } from '../Package';
import { Router } from '../../Router/Router';

describe('Package', () => {
  var packName = 'Package';
  var packPath = path.join(__rodeBase, `mockApp/src/${packName}`);
  var pack;

  beforeEach(() => pack = new Package(packName, packPath));

  describe('get file paths', () => {

    it('should return the package path if is called without parameters', () => {
      expect(pack.getPath()).to.be(packPath);
    });

    it('should return the path of the file specified', () => {
      expect(pack.getPath('routes.js')).to.be(path.join(packPath, 'routes.js'));
      expect(pack.getPath('Controller/PackageController.js')).to.be(path.join(packPath, 'Controller/PackageController.js'));
      expect(pack.getPath('SOME TEXT')).to.be(path.join(packPath, 'SOME TEXT'));
    });

  });

  describe('get controllers', () => {

    it('should return the default controller if is called without parameters', () => {
      var controller = pack.getController();
      expect(controller.name).to.be(`${pack.name}Controller`);
    });

    it('should return the controller specified', () => {
      var controller = pack.getController('Another');
      expect(controller.name).to.be('AnotherController');
    });

    it('should throw an error if the controller not exists', () => {
      expect(() => pack.getController('nonExistent')).to.throwError();
    });

  });

  describe('routes', () => {

    it('should return the path to routes file', () => {
      expect(pack.routesPath).to.be(path.join(packPath, 'routes.js'));
    });

    it('should return the router of the package', () => {
      var router = pack.router;
      expect(router).to.be.a(Router);
      expect(router.pack).to.be(pack);
    });

    it('should not throw an error if the package not have routes file', () => {
      var pack3Name = 'Package3';
      var pack3Path = path.join(__rodeBase, `mockApp/src/${packName}`);
      var pack3 = new Package(pack3Name, pack3Path);
      expect(() => pack3.router).to.not.throwError();
    });
  });

});
