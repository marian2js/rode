import { Router } from '../../../loader';

var router = new Router();
router.base = '/pack2';
router.restApi = '/api/';

/**
 * [GET] /pack2
 * Calls Package2Controller.index
 */
router.add({
  action: 'index'
});

export {router};