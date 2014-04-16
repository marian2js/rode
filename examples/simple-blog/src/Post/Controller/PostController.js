import { Post } from '../Model/Post';

/**
 * Post Controller
 */
export class PostController {

  /**
   * Show a single post
   */
  showPost(req, res) {
    var postId = req.param('id');
    Post.findById(postId)
      .then(post => {
        if (post) {
          res.render('Post/index', {
            post: post
          });
        } else {
          res.send(404, 'Post not found!');
        }
      })
      .catch(err => res.send(500, `Unexpected Error: ${err}`));
  }

  /**
   * Show the add post form
   */
  showAddPost(req, res) {
    res.render('Post/add', {
      title: 'Add Post'
    });
  }

  /**
   * Add a new post
   */
  addPost(req, res) {
    var postData = {
      title: req.param('title'),
      body: req.param('body'),
      tags: req.param('tags')
    };
    var post = new Post(postData);
    post.save()
      .then(() => res.redirect(`/post/${post._id}`))
      .catch(err => res.send(500, `Unexpected Error: ${err}`));
  }

}