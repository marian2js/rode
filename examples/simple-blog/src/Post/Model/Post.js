var mongoose = require('mongoose');

/***********************************
 * NOTE:
 * You could export directly the mongoose schema and work with mongoose objects, and this example will have the
 * same results, but is a good practice to not expose the mongoose schema outside of this model.
 ***********************************/

/**
 * Post Model
 */
export class Post {

  constructor(obj) {
    this._loadObject(obj);
  }

  /**
   * Load an object on the model
   *
   * @param obj
   * @private
   */
  _loadObject(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }
  }

  /**
   * Store the model
   *
   * @return {Promise}
   */
  save() {
    // validate the tags
    if (!Array.isArray(this.tags)) {
      this.tags = this.tags.split(',');
    }
    this.tags = this.tags.map(tag => tag.trim());

    this.posted = Date.now();
    return new Promise((resolve, reject) => {
      var doc = new Post._mongooseModel(this);
      doc.save(err => {
        if (err) return reject(err);
        this._loadObject(doc._doc);
        resolve();
      });
    });
  }

  /**
   * Promise a post with the specific id
   *
   * @param id
   * @return {Promise.<Post>}
   */
  static findById(id) {
    return new Promise((resolve, reject) => {
      Post._mongooseModel
        .findById(id)
        .exec((err, doc) => {
          if (err) return reject(err);
          resolve(doc && new Post(doc._doc));
        });
    });
  }

  /**
   * Promise an array of posts order by posted time
   *
   * @param {number} [skip=0]
   * @param {number} [limit=10]
   * @return {Promise.<Post>}
   */
  static findLatestPosted(skip = 0, limit = 10) {
    return new Promise((resolve, reject) => {
      Post._mongooseModel
        .find({}, {}, {
          skip: skip,
          limit: limit,
          sort: {
            posted: -1
          }
        })
        .exec((err, docs) => {
          var posts = [];
          if (err) return reject(err);
          docs.forEach(doc => posts.push(new Post(doc._doc)));
          resolve(posts);
        });
    });
  }

  /**
   * Promise the number of posts
   *
   * @return {Promise}
   */
  static count() {
    return new Promise((resolve, reject) => {
      Post._mongooseModel
        .count()
        .exec((err, count) => {
          if (err) return reject(err);
          resolve(count);
        });
    });
  }

  /**
   * Returns the mongoose schema for this model
   *
   * @private
   */
  static get _schema() {
    return new mongoose.Schema({
      title: String,
      body: String,
      tags: [ String ],
      posted: Date
    });
  }

  /**
   * Returns the mongoose model and ensure that will be compiled once
   *
   * @private
   */
  static get _mongooseModel() {
    if (!this.__mongooseModel) {
      this.__mongooseModel = mongoose.model('Post', Post._schema);
    }
    return this.__mongooseModel;
  }
}