export class InvalidParamsError extends Error {

  constructor(message) {
    this.name = 'InvalidParamsError';
    this.message = message;
  }

}