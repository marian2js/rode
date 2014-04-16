import { Post } from '../../Post/Model/Post';

/**
 * Main Controller
 */
export class MainController {

  /**
   * Index Action
   */
  index(req, res) {
    var postsPerPage = 10;
    var currentPage = req.param('page') || 1;
    var skipPosts = (currentPage - 1) * postsPerPage;
    Promise
      .all([
        Post.findLatestPosted(skipPosts, postsPerPage),
        Post.count()
      ])
      .spread((posts, count) => {
        res.render('Main/index', {
          title: 'Blog Index',
          posts: posts,
          pages: Math.ceil(count / postsPerPage),
          currentPage: Number(currentPage)
        });
      })
      .catch(err => res.send(500, `Unexpected Error: ${err}`));
  }

}