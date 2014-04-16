import { Router } from 'rode/loader';

var router = new Router();
router.base = '/post/';

/**
 * [GET] /
 * Calls PostController.index
 */
router
  .add({
    action: 'showAddPost',
    pattern: 'add'
  })
  .add({
    action: 'addPost',
    pattern: 'add',
    method: 'post'
  })
  .add({
    action: 'showPost',
    pattern: ':id'
  });

export {router};