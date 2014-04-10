var ejs = require('ejs-locals');
import { ViewEngine } from './ViewEngine';

export class EjsViewEngine extends ViewEngine {

  constructor(app, views) {
    super(app, views);
  }

  /**
   * Config ejs views using ejs-locals module
   */
  config() {
    super.config();
    this.app.engine('ejs', ejs);
  }

}