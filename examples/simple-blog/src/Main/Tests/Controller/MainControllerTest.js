var expect = require('expect.js');
var sinon = require('sinon');
import { MainController } from '../../Controller/MainController';
import { Post } from '../../../Post/Model/Post';

describe('MainController', () => {
  var mainController;

  beforeEach(() => mainController = new MainController);

  afterEach(() => {
    Post.findLatestPosted.restore();
    Post.count.restore();
  });

  /**
   * Test if mainController.index render a view correctly
   */
  it('should render a view with the latest post', done => {
    var fakePosts = [
      new Post({
        _id: 'fake_id',
        title: 'Fake Post',
        body: 'Fake Body'
      }),
      new Post({
        _id: 'fake_id_2',
        title: 'Fake Post 2',
        body: 'Fake Body 2'
      })
    ];

    // Create a spy on Post.findLatestPosted()
    sinon.stub(Post, 'findLatestPosted', (skip, limit) => {
      return new Promise(resolve => {
        resolve(fakePosts);
      });
    });

    // Create a spy on Post.count()
    sinon.stub(Post, 'count', () => {
      return new Promise(resolve => {
        resolve(2);
      });
    });

    var req = {
      param() {
        return 1;
      }
    };
    var res = {
      render(view, data) {
        expect(view).to.be('Main/index');
        expect(data.title).to.be('Blog Index');
        expect(data.posts).to.be.an(Array);
        expect(data.posts.length).to.be(2);
        expect(data.currentPage).to.be(1);
        done();
      }
    };
    mainController.index(req, res);
  });

});