import { Router } from 'rode/loader';

var router = new Router();
router.base = '/';

/**
 * [GET] /
 * Calls MainController.index
 */
router.add({
  action: 'index'
});

export {router};