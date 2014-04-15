export class AbstractDB {

  constructor(uri, options = {}) {
    this.uri = uri;
    this.options = options;
    this.isOpen = false;
  }

  /**
   * Overwrite this method with specific database connection
   */
  connect() {
    throw new Error('Connect not implemented');
  }

  /**
   * Overwrite this method with specific database close connection
   */
  close() {
    throw new Error('Close not implemented');
  }

}