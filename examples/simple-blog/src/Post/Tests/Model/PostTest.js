var expect = require('expect.js');
var sinon = require('sinon');
var mongoose = require('mongoose');
import { Post } from '../../Model/Post';

describe('Post', () => {

  describe('Instance', () => {
    var post;
    var fakeData;

    /**
     * Creates a new Post instance and fake data
     */
    beforeEach(() => {
      fakeData = {
        title: 'fake title',
        body: 'fake body',
        tags: 'tag1, tag2, tag3'
      };
      post = new Post
    });

    describe('_loadObject()', () => {

      /**
       * Test if the fake data was loaded on post
       */
      it('should load an object on the model', () => {
        post._loadObject(fakeData);
        expect(post.title).to.be(fakeData.title);
        expect(post.body).to.be(fakeData.body);
        expect(post.tags).to.be(fakeData.tags);
      });

    });

    describe('save()', () => {
      var mongooseModel = Post._mongooseModel.prototype;

      /**
       * Restores the original functionality of save()
       */
      afterEach(() => mongooseModel.save.restore());

      /**
       * Test if mongoose.save is called correctly
       */
      it('should call to mongoose\'s save method', done => {
        // Create a spy on mongoose save()
        sinon.stub(mongooseModel, 'save', fn => {
          fn(null);
        });

        post._loadObject(fakeData);
        post.save()
          .then(() => {
            // test if the post was reloaded correctly
            expect(post).to.be.a(Post);
            expect(post._id).to.be.a(mongoose.Types.ObjectId);
            expect(post.title).to.be(fakeData.title);
            expect(post.body).to.be(fakeData.body);
            expect(post.tags).to.be.an(Array);
            expect(post.tags[0]).to.be('tag1');
            expect(post.tags[1]).to.be('tag2');
            expect(post.tags[2]).to.be('tag3');
            expect(post.posted).to.be.a(Date);
          })
          .catch(err => expect().fail(err))
          .done(done);
      });

      /**
       * Test if a mongoose error is catched by the promise
       */
      it('should fail if mongoose fails', done => {
        // Create a spy on mongoose save()
        sinon.stub(mongooseModel, 'save', fn => {
          fn('Fake Error');
        });

        post._loadObject(fakeData);
        post.save()
          .then(() => expect().fail('It should never be here!'))
          .catch(err => {
            expect(err).to.be('Fake Error');
          })
          .done(done);
      });

    });

  });

  describe('Statics', () => {
    var mongooseModel = Post._mongooseModel;

    describe('findById()', () => {

      afterEach(() => mongooseModel.findById.restore());

      /**
       * Test if mongoose find is called correctly
       */
      it('should find a post by id', done => {
        var id = 'fake_id';
        var fakeDoc = {
          _doc: {
            _id: id,
            title: 'Fake Doc',
            body: 'Fake Body',
            tags: [ 'tag1', 'tag2', 'tag3' ],
            posted: Date.now()
          }
        };

        // Create a spy on mongoose findById()
        sinon.stub(mongooseModel, 'findById', _id => {
          expect(_id).to.be(id);
          return {
            exec(fn) {
              fn(null, fakeDoc);
            }
          }
        });

        Post.findById(id)
          .then(post => {
            expect(post).to.be.a(Post);
            expect(post._id).to.be(id);
            expect(post.title).to.be(fakeDoc._doc.title);
            expect(post.body).to.be(fakeDoc._doc.body);
            expect(post.tags).to.be(fakeDoc._doc.tags);
            expect(post.posted).to.be(fakeDoc._doc.posted);
          })
          .catch(err => expect().fail(err))
          .done(done);
      });

      /**
       * Test if a mongoose error is catched by the promise
       */
      it('should fail if mongoose fails', done => {
        // Create a spy on mongoose findById()
        sinon.stub(mongooseModel, 'findById', () => {
          return {
            exec(fn) {
              fn('Fake Error');
            }
          };
        });

        Post.findById('id')
          .then(() => expect().fail('It should never be here!'))
          .catch(err => {
            expect(err).to.be('Fake Error');
          })
          .done(done);
      });

    });

    describe('findLatestPosted()', () => {
      var fakeDocs = [
        {
          _doc: {
            _id: 'fake_id',
            title: 'fake_doc',
            posted: Date.now()
          }
        }, {
          _doc: {
            _id: 'fake_id2',
            title: 'fake_doc2',
            posted: Date.now()
          }
        }
      ];

      /**
       * Test if an array of docs is an array of Pages with the fake docs
       *
       * @param {Array} docs
       */
      var checkDocs = function (docs) {
        expect(docs).to.be.an(Array);
        expect(docs[0]).to.be.a(Post);
        expect(docs[0]._id).to.be(fakeDocs[0]._doc._id);
        expect(docs[0].title).to.be(fakeDocs[0]._doc.title);
        expect(docs[0].posted).to.be(fakeDocs[0]._doc.posted);
        expect(docs[1]._id).to.be(fakeDocs[1]._doc._id);
        expect(docs[1].title).to.be(fakeDocs[1]._doc.title);
        expect(docs[1].posted).to.be(fakeDocs[1]._doc.posted);
      };

      afterEach(() => mongooseModel.find.restore());

      /**
       * Test if mongoose find is called correctly to find the 10 latest posts
       */
      it('should find the latest post added using the default parameters', done => {
        // Create a spy on mongoose find()
        sinon.stub(mongooseModel, 'find', (query, attrs, options) => {
          expect(query).to.be.empty();
          expect(attrs).to.be.empty();
          expect(options.skip).to.be(0);
          expect(options.limit).to.be(10);
          expect(options.sort.posted).to.be(-1);
          return {
            exec(fn) {
              fn(null, fakeDocs);
            }
          }
        });

        Post.findLatestPosted()
          .then(checkDocs)
          .catch(err => expect().fail(err))
          .done(done);
      });

      /**
       * Test if mongoose find is called correctly to find the 15 latest post, starting from the post 20
       */
      it('should find the latest post added using skip = 20 and limit = 15', done => {
        // Create a spy on mongoose find()
        sinon.stub(mongooseModel, 'find', (query, attrs, options) => {
          expect(query).to.be.empty();
          expect(attrs).to.be.empty();
          expect(options.skip).to.be(20);
          expect(options.limit).to.be(15);
          expect(options.sort.posted).to.be(-1);
          return {
            exec(fn) {
              fn(null, fakeDocs);
            }
          };
        });

        Post.findLatestPosted(20, 15)
          .then(checkDocs)
          .catch(err => expect().fail(err))
          .done(done);
      });

      /**
       * Test if a mongoose error is catched by the promise
       */
      it('should fail if mongoose fails', done => {
        // Create a spy on mongoose find()
        sinon.stub(mongooseModel, 'find', () => {
          return {
            exec(fn) {
              fn('Fake Error');
            }
          };
        });

        Post.findLatestPosted()
          .then(() => expect().fail('It should never be here!'))
          .catch(err => {
            expect(err).to.be('Fake Error');
          })
          .done(done);
      });

    });

    describe('count()', () => {

      afterEach(() => mongooseModel.count.restore());

      /**
       * Test if mongoose count is called correctly
       */
      it('should return the number of post', done => {
        var fakeCount = 320;

        // Create a spy on mongoose count()
        sinon.stub(mongooseModel, 'count', () => {
          return {
            exec(fn) {
              fn(null, fakeCount);
            }
          };
        });

        Post.count()
          .then(count => {
            expect(count).to.be(fakeCount);
          })
          .catch(err => expect().fail(err))
          .done(done);
      });

      /**
       * Test if a mongoose error is catched by the promise
       */
      it('should fail if mongoose fails', done => {
        // Create a spy on mongoose count()
        sinon.stub(mongooseModel, 'count', () => {
          return {
            exec(fn) {
              fn('Fake Error');
            }
          };
        });

        Post.count()
          .then(() => expect().fail('It should never be here!'))
          .catch(err => {
            expect(err).to.be('Fake Error');
          })
          .done(done);
      });

    });

  });

});