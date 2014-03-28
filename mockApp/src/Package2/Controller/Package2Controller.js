export class Package2Controller {

  get index() {
    return [
      // Middleware
      (req, res, next) => {
        next();
      },
      (req, res) => {
        res.send('[GET] /');
      }
    ];
  }

}