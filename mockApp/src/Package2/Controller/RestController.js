export class RestController {

  get(req, res) {
    res.send('[GET] /api/pack2');
  }

  post(req, res) {
    res.send('[POST] /api/pack2');
  }

  getProducts(req, res) {
    res.send('[GET] /api/pack2/products');
  }

  postProducts(req, res) {
    res.send('[POST] /api/pack2/products');
  }

  getProductsById(req, res) {
    res.send('[GET] /api/pack2/products/:id');
  }

  putProductsById(req, res) {
    res.send('[PUT] /api/pack2/products/:id')
  }

  deleteProductsById(req, res) {
    res.send('[DELETE] /api/pack2/products/:id');
  }

}