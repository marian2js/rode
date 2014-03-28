import { Router } from '../../../loader';

var router = new Router();
router.base = '/';

/**
 * [GET] /
 * Calls PackageController.index
 */
router.add({
  action: 'index'
});

/**
 * [GET] /hello
 * Calls PackageController.sayHello
 */
router.add({
  pattern: 'hello',
  action: 'sayHello'
});

/**
 * [POST] /another
 * Calls AnotherController.index
 */
router.add({
  controller: 'Another',
  pattern: 'another',
  action: 'index',
  method: 'post'
});

export {router};