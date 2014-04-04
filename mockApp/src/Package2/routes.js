import { Router } from '../../../loader';

var router = new Router();
router.restApi = '/api/';
router.base = '/pack2';

/**
 * [GET] /pack2
 * Calls Package2Controller.index
 */
router.add({
  action: 'index'
});

export {router};