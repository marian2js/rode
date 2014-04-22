import { Observable } from './Observable';

export class Model extends Observable {

  /**
   * @param [data]
   */
  constructor(data) {
    super();

    // load the data on the model
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        this[key] = data[key];
      }
    }
  }

}