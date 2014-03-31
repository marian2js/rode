var path = require('path');
var http = require('http');
var url = require('url');
var express = require('express');
var _ = require('underscore');

export class Server {

  constructor() {
    this.express = express;
    this.app = express();
    this.isRunning = false;
  }

  /**
   * Run the app
   *
   * @return {Promise}
   */
  run() {
    return new Promise(resolve => {
      if (this.isRunning) {
        resolve();
        return;
      }
      this.server = http.createServer(this.app)
          .listen(this.app.get('port'), () => {
            this.isRunning = true;
            resolve();
          });
    });
  }

  /**
   * Stop the app
   */
  stop() {
    if (!this.isRunning) {
      resolve();
      return;
    }
    this.server.close();
    this.isRunning = false;
  }

  /**
   * Apply all the configurations to the server
   *
   * @param {Core} core
   */
  config(core) {
    var config = core.options;

    // Config Port
    var port = process.env.PORT || config.get('port') || 3000;
    config.set('port', port);
    this.app.set('port', port);

    // Config Host
    if (config.has('baseUri') && !config.has('host')) {
      var host = url.parse(config.get('baseUri')).host;
      if (host.startsWith('www.')) {
        host = host.replace('www.', '');
      }
      config.set('host', host);
    }

    // Config Favicon
    if (config.has('favicon')) {
      this.app.use(config.get('favicon'));
    }

    // Config Logger
    if (config.has('logger')) {
      this.app.use(config.get('logger'));
    }

    // Config CSS
    switch (config.css) {
      case 'less':
        this.app.use(require('less-middleware')(
            this.getPath('statics'),
            {
              compress: core.env === 'production'
            }
        ));
        break;
      case 'stylus':
        this.app.use(require('stylus').middleware(this.getPath('statics')));
    }

    // Config Statics
    this.app.use(this.express.static(core.getPath('statics')));

    // Config Error Handler
    if (config.has('errorHandler')) {
      this.app.use(this.express.errorHandler());
    }

    // Config BodyParser
    if (config.has('bodyParser')) {
      this.app.use(this.express.bodyParser());
    }
  }

  /**
   * Create app routes on express
   *
   * @param {List.<Package>} packages
   */
  createRoutes(packages) {
    packages.forEach(pack => this.addRoutes(pack.router));
  }

  /**
   * Add all the routes of a Router to express
   *
   * @param {Router} router
   */
  addRoutes(router) {
    if (!router) {
      return;
    }
    router.forEach(route => {
      this.count++;
      var controller = router.pack.getController(route.controller);
      var controllerInstance = new controller;
      var call = controllerInstance[route.action];
      var pattern = path.join(router.base, route.pattern);

      // Fix routes patterns across the different OS.
      if (pattern.indexOf('\\') !== -1) {
        pattern = S(pattern).replaceAll('\\', '/').s;
      }
      while (pattern.indexOf('//') !== -1) {
        pattern = S(pattern).replaceAll('//', '/').s;
      }
      if (pattern.endsWith('/')) {
        pattern = pattern.substring(0, pattern.length - 1);
      }

      // If call is an array, the firsts items are middlewares
      if (Array.isArray(call)) {
        var middlewares = call;
        call = middlewares.pop();
        this.app[route.method](pattern || '/', ...middlewares);
      }

      // Send the route to express
      if (!_.isFunction(call)) {
        throw new TypeError(`Package ${router.name}: Route action should be a Function.
        You need to implement the method '${route.action}' on '${controller.name}'`);
      }

      this.app[route.method](pattern || '/', call);
    });
  }
}