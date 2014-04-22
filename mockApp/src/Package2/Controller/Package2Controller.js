export class Package2Controller {

  index() {
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