var path = require('path');
var os = require('os');
var soynode = require('soynode');
import { ViewEngine } from './ViewEngine';

export class SoyViewEngine extends ViewEngine {

  constructor(app, views) {
    super(app, views);
  }

  /**
   * Config Google Closure Templates
   *
   * @link http://www.technology-ebay.de/the-teams/mobile-de/blog/node-js-with-express-and-closure-templates.html
   */
  config() {
    var soyRenderer;
    soynode.setOptions({
      outputDir: os.tmpdir(),
      uniqueDir: true,
      allowDynamicRecompile: true,
      eraseTemporaryFiles: true
    });
    this.app.set('view engine', '.soy');
    soyRenderer = function(_path, options, callback) {
      var templatePath = _path.replace(path.normalize(this.root + '/'), '');
      templatePath = templatePath.replace('.soy', path.sep + options.template);
      templatePath = templatePath.split(path.sep).join('.');
      callback(null, soynode.render(templatePath, options));
    };
    this.app.engine('.soy', soyRenderer);
    this.app.use(function(req, res, next) {
      res.locals.soynode = soynode;
      next();
    });
  }

  /**
   * Compile Google Closure Templates
   *
   * @link http://www.technology-ebay.de/the-teams/mobile-de/blog/node-js-with-express-and-closure-templates.html
   * @return {Promise}
   */
  compile() {
    return new Promise((resolve, reject) => {
      soynode.compileTemplates(this.views.path, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

}