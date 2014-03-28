export class InvalidParameterError extends Error {

  constructor() {
    throw super(...arguments);
  }

}