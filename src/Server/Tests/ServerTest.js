var path = require('path');
var expect = require('expect.js');
import { Server } from '../Server';
import { Core } from '../../Core/Core';
import { Package } from '../../Package/Package';
import { List } from '../../Util/List';

describe('Server', () => {
  var server;

  beforeEach(() => server = new Server);

  describe('Config', () => {

    it('should configure express', () => {
      var fakePath = path.join(__rodeBase, 'mockApp');
      var core = new Core(fakePath);
      server.config(core);
      expect(server.app.get('port')).to.be(3000);
      expect(core.options.get('baseUri')).to.be('http://localhost');
      expect(core.options.get('host')).to.be('localhost');
    });

  });

  describe('Routing', () => {

    /**
     * Test if the routes of a router were added to express
     *
     * @param {Router} router
     */
    var testExpressRoutes = function (router) {
      var expressRoutes = new List;
      for (var method in server.app.routes) {
        if (server.app.routes.hasOwnProperty(method)) {
          expressRoutes.add(server.app.routes[method]);
        }
      }
      router.forEach(route => {
        var routePath;
        var exists;
        if (route.isRestful) {
          routePath = path.join(router.restApi, router.base, route.pattern);
        } else {
          routePath = path.join(router.base, route.pattern);
        }
        exists = expressRoutes.some(eRoute => eRoute.path === routePath);
        expect(exists).to.be(true);
      });
    };

    it('should add the routes of a router to express', () => {
      var packName = 'Package';
      var packPath = path.join(__rodeBase, `mockApp/src/${packName}`);
      var pack = new Package(packName, packPath);
      var router = pack.router;
      server.addRoutes(router);
      testExpressRoutes(router);
    });

    it('should add the routes of a REST router to express', () => {
      var packName = 'Package2';
      var packPath = path.join(__rodeBase, `mockApp/src/${packName}`);
      var pack = new Package(packName, packPath);
      var router = pack.router;
      server.addRoutes(router);
      expect(router.getAll().some(route => route.controller === 'Rest')).to.be(true);
      testExpressRoutes(router);
    });

  });

  describe('Running and stopping the server', () => {
    var server = new Server;
    var fakePath = path.join(__rodeBase, 'mockApp');
    var core = new Core(fakePath);

    it('should run the server on specified port', done => {
      server.config(core);
      server.run()
        .then(() => {
          expect(server.isRunning).to.be(true);
          done();
        })
        .done();
    });

    it('should stop the server', () => {
      server.stop();
      expect(server.isRunning).to.be(false);
    });

  });

});

