export class PackageController {

  index(req, res) {
    res.send('[GET] /');
  }

  sayHello(req, res) {
    res.send('[GET] /hello');
  }

}