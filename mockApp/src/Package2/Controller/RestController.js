export class RestController {

  get(req, res) {
    res.send('[GET] /api/');
  }

  post(req, res) {
    res.send('[POST] /api/');
  }

  getProducts(req, res) {
    res.send('[GET] /api/products');
  }

  postProducts(req, res) {
    res.send('[POST] /api/products');
  }

  getProductsById(req, res) {
    res.send('[GET] /api/products/:id');
  }

  putProductsById(req, res) {
    res.send('[PUT] /api/products/:id')
  }

  deleteProductsById(req, res) {
    res.send('[DELETE] /api/products/:id');
  }

}