export class ViewEngine {

  constructor(app, views) {
    this.app = app;
    this.views = views;
  }

  /**
   * Config view engine
   */
  config() {
    this.app.set('views', this.views.path || '');
    this.app.set('view engine', this.views.engine || 'jade');
  }

  /**
   * Compile views
   * This is useful only for views that need to be compiled
   *
   * @return {Promise}
   */
  compile() {
    return new Promise(resolve => resolve());
  }

  /**
   * Create a new instance of the specific view engine class
   *
   * @param app
   * @param views
   * @return {ViewEngine}
   */
  static createInstance(app, views) {
    switch (views.engine) {
      case 'ejs':
        return new (require('./EjsViewEngine').EjsViewEngine)(app, views);
      case 'soy':
        return new (require('./SoyViewEngine').SoyViewEngine)(app, views);
      default:
        return new ViewEngine(app, views);
    }
  }

}