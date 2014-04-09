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

  describe('exists', () => {
    var pack2 = new Package('not exists', '/this_package_not_exists');

    /**
     * Test if exists works correctly
     */
    it('should check if a package exists', done => {
      var count = 0;
      var expected = 2;
      var checkDone = function () {
        if (++count === expected) {
          done();
        }
      };
      pack.exists()
        .then(exists => {
          expect(exists).to.be(true);
          checkDone();
        });
      pack2.exists()
        .then(exists => {
          expect(exists).to.be(false);
          checkDone();
        });
    });

    /**
     * Test if existsSync works correctly
     */
    it('should check if a package exists synchronously', () => {
      expect(pack.existsSync()).to.be(true);
      expect(pack2.existsSync()).to.be(false);
    });

    /**
     * Test if exists works with specific resources
     */
    it('should check if a resource exists', done => {
      var count = 0;
      var expected = 2;
      var checkDone = function () {
        if (++count === expected) {
          done();
        }
      };
      pack.exists('Controller/AnotherController.js')
        .then(exists => {
          expect(exists).to.be(true);
          checkDone();
        });
      pack.exists('NON EXISTENT RESOURCE')
        .then(exists => {
          expect(exists).to.be(false);
          checkDone();
        });
    });

    /**
     * Test if exists works with specific resources synchronously
     */
    it('should check if a resource exists synchronously', () => {
      expect(pack.existsSync('Controller/AnotherController.js')).to.be(true);
      expect(pack.existsSync('NON EXISTENT RESOURCE')).to.be(false);
    });

  });

});
