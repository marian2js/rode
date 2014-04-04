var path = require('path');
var expect = require('expect.js');
var request = require('request');
import { Core } from '../Core';
import { PackageList } from '../../Package/PackageList';

describe('Core', () => {
  // mock app with
  var fakePath = path.join(__rodeBase, 'mockApp');

  describe('constructor', () => {

    it('should allow to create new instances', () => {
      var core = new Core(fakePath);
      expect(core).to.be.a(Core);
    });

    it('should allow to pass the environment on construction', () => {
      var core = new Core(fakePath, 'production');
      expect(core.env).to.be('production');
    });

    it('should have default environment', () => {
      var core = new Core(fakePath);
      expect(core.env).to.be(process.env.NODE_ENV || 'development');
    });

    it('should throw an exception if path is not specified', () => {
      expect(() => new Core).to.throwError();
    });

    it('should store the last instance of Core as static property', () => {
      var core = new Core(fakePath);
      expect(Object.is(Core.instance, core)).to.be(true);
    });

  });

  describe('config', () => {
    var core;

    beforeEach(() => core = new Core(fakePath));

    it('should allow to configure the app', done => {
      core.config(app => {
        expect(app).to.be.an(Object);
        expect(app.use).to.be.a(Function);
        done();
      });
    });

    it('should throw an error if a callback is not passed', () => {
      expect(core.config).to.throwError();
    });

  });

  describe('get paths', () => {
    var core = new Core(fakePath);

    it('should return src path', () => {
      var srcPath = core.getPath('src');
      expect(srcPath).to.be(path.join(fakePath, 'src'));
    });

    it('should return views path', () => {
      var viewsPath = core.getPath('views');
      expect(viewsPath).to.be(path.join(fakePath, 'views'));
    });

    it('should return statics/public path', () => {
      var staticsPath = core.getPath('statics');
      var publicPath = core.getPath('public');
      expect(staticsPath).to.be(publicPath);
      expect(publicPath).to.be(path.join(fakePath, 'public'));
    });

    it('should return images path', () => {
      var imagesPath = core.getPath('images');
      expect(imagesPath).to.be(path.join(fakePath, 'public/images'));
    });

    it('should return js path', () => {
      var javascriptPath = core.getPath('javascript');
      var jsPath = core.getPath('js');
      expect(javascriptPath).to.be(jsPath);
      expect(jsPath).to.be(path.join(fakePath, 'public/js'));
    });

    it('should return css path', () => {
      var stylesheetsPath = core.getPath('stylesheets');
      var cssPath = core.getPath('css');
      expect(stylesheetsPath).to.be(cssPath);
      expect(cssPath).to.be(path.join(fakePath, 'public/css'));
    });

    it('should return root path', () => {
      var rootPath = core.getPath('root');
      expect(rootPath).to.be(fakePath);
    });
  });

  describe('Run app', () => {
    var core = new Core(fakePath);
    core.packageList = new PackageList;
    var protocol;
    var host;
    var port;

    /**
     * Run the server and config protocol, host and port
     */
    beforeEach(done => {
      core.run()
        .then(() => {
          protocol = 'http';
          host = core.options.get('host');
          port = core.options.get('port');
        })
        .done(done);
    });

    /**
     * Stop the server
     */
    afterEach(() => {
      if (core.server.isRunning) {
        core.stop();
      }
    });

    /**
     * Test if the host and port are set correctly
     */
    it('should run the app on specified host and port', () => {
      expect(core.app.get('port')).to.be(core.options.get('port'));
      expect(core.options.get('port')).to.be(3000);
      expect(core.options.get('host')).to.be('localhost');
    });

    /**
     * Test if [GET] http://localhost:3000/ is accessible
     */
    it('should respond to any route with method GET', done => {
      var options = {
        uri: `${protocol}://${host}:${port}`
      };
      request(options, (err, res, body) => {
        expect(err).to.be(null);
        expect(body).to.be('[GET] /');
        done();
      });
    });

    /**
     * Test if [POST] http://localhost:3000/another is accessible
     */
    it('should respond to any route with method POST', done => {
      var options = {
        uri: `${protocol}://${host}:${port}/another`,
        method: 'POST'
      };
      request(options, (err, res, body) => {
        expect(err).to.be(null);
        expect(body).to.be('[POST] /another');
        done();
      });
    });

    /**
     * Test if [GET] http://localhost:3000/api/pack2 is accessible
     */
    it('should respond to any REST route with method GET', done => {
      var options = {
        uri: `${protocol}://${host}:${port}/api/pack2`
      };
      request(options, (err, res, body) => {
        expect(err).to.be(null);
        expect(body).to.be('[GET] /api/pack2');
        done();
      });
    });

    /**
     * Test if [POST] http://localhost:3000/api/pack2 is accessible
     */
    it('should respond to any REST route with method POST', done => {
      var options = {
        uri: `${protocol}://${host}:${port}/api/pack2`,
        method: 'POST'
      };
      request(options, (err, res, body) => {
        expect(err).to.be(null);
        expect(body).to.be('[POST] /api/pack2');
        done();
      });
    });

  });

});
