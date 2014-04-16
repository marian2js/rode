var expect = require('expect.js');
var sinon = require('sinon');
import { PostController } from '../../Controller/PostController';
import { Post } from '../../Model/Post';

describe('PostController', () => {
  var postController;

  beforeEach(() => postController = new PostController);

  /**
   * Test if postController.showPost render a view correctly
   */
  it('should render a view with the specified post', done => {
    var fakePost = new Post({
      _id: 1,
      title: 'fake title',
      body: 'fake body'
    });
    var req = {
      param() {
        return 1;
      }
    };
    var res = {
      render(view, data) {
        expect(view).to.be('Post/index');
        expect(data).to.be.an(Object);
        expect(data.post).to.be(fakePost);
        Post.findById.restore();
        done();
      }
    };

    // Create a spy on Post.findById()
    sinon.stub(Post, 'findById', () => {
      return new Promise(resolve => {
        resolve(fakePost);
      });
    });

    postController.showPost(req, res);
  });

  /**
   * Test if postController.showAddPost render a view correctly
   */
  it('should render the add post form', done => {
    var req = {};
    var res = {
      render(view, data) {
        expect(view).to.be('Post/add');
        expect(data).to.be.an(Object);
        expect(data.title).to.be('Add Post');
        done();
      }
    };
    postController.showAddPost(req, res);
  });

  /**
   * Test if postController.addPost add a post and redirect to it
   */
  it('should receive a new post and redirect to it', done => {
    var fakePost = new Post({
      title: 'fake title',
      body: 'fake body'
    });
    var req = {
      param() {
        return '';
      }
    };
    var res = {
      redirect(page) {
        expect(page).to.be('/post/fake_id');
        Post.prototype.save.restore();
        done();
      }
    };

    // Create a spy on Post.findById()
    sinon.stub(Post.prototype, 'save', function () {

      return new Promise(resolve => {
        this._id = 'fake_id';
        resolve(fakePost);
      });
    });

    postController.addPost(req, res);
  });

});