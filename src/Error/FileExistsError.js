export class FileExistsError extends Error {

  constructor(message) {
    this.name = 'FileExistsError';
    this.message = message;
  }

}