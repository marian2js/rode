var path = require('path');
var fs = require('extfs');
var mongoose = require('mongoose');
import { AbstractDB } from './AbstractDB';
import { Core } from '../Core/Core';

export class Mongo extends AbstractDB {

  constructor(uri, options) {
    super(uri, options);
  }

  /**
   * Connect to mongodb
   *
   * @return {Promise}
   */
  connect() {
    this._linkMongoose();
    return new Promise((resolve, reject) => {
      mongoose.connect(this.uri, this.options);
      this.connection = mongoose.connection;
      this.connection.on('connected', () => {
        this.isOpen = true;
        resolve(this.connection)
      });
      this.connection.on('error', reject);
    });
  }

  /**
   * Close connection with mongodb
   */
  close() {
    this.isOpen = false;
    return this.connection.close();
  }

  /**
   * If the app has mongoose installed, replace its mongoose module with the mongoose module of rode
   *
   * @private
   */
  _linkMongoose() {
    var mongoosePath = path.join(__rodeBase, 'node_modules', 'mongoose');
    var appMongoosePath = path.join(Core.instance.getPath('node_modules'), 'mongoose');
    if (fs.existsSync(mongoosePath) && fs.existsSync(appMongoosePath)) {
      fs.removeSync(appMongoosePath);
      fs.symlinkSync(mongoosePath, appMongoosePath);
    }
  }

}