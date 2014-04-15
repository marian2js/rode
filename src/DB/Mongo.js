var mongoose = require('mongoose');
import { AbstractDB } from './AbstractDB';

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

}