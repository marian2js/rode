RodeJS
====

Smart Packet-Oriented Framework for [Express](http://expressjs.com) and [Mongoose](http://mongoosejs.com).

##Table of Contents:

- [Quick Start](#quick-start)
- [Packages](#packages)
- [Models](#models)
- [Models with Mongoose](#models-with-mongoose)
- [Models validators](#models-validators)
- [Controllers](#controllers)
- [Middleware on Routes](#middleware-routes)
- [Restful APIs](#restful-apis)
- [Tests](#tests)
- [Templates engines](#templates-engines)

## <a name="quick-start"></a>Quick Start

Installing Rode and setting up your application:

    # npm install -g rode bower grunt-cli
    $ rode generate --sessions --css stylus --ejs myapp

Install dependencies:

    $ npm install

Start the server:

    $ node app


The usage of `rode generate` is nearly the same that [Express](http://expressjs.com)

    Usage: rode generate [options] [dir]

    Options:

      -h, --help          output usage information
      -V, --version       output the version number
      -s, --sessions      add session support
      -e, --ejs           add ejs engine support (defaults to jade)
      -H, --hogan         add hogan.js engine support
      -S, --soy           add Google Closure Templates engine support
      -c, --css           add stylesheet support (less|stylus) (defaults to plain css)
      -f, --force         force on non-empty directory


## <a name="packages"></a>Packages

A package (or bundle) is a component of your application with its own MVC.

You can simply create a new package with the command:

    $ rode new-package PackageName

    Usage: rode new-package <package>

    Options:

      -h, --help   output usage information
      -r, --rest   config rest api for this package
      -f, --force  force on existing package


## <a name="models"></a>Models

Models are modules really extensible.
The `extend` method works similar to [Backbone.js](http://backbonejs.org/#Model-extend)

```js
var rode = require('rode');

var User = rode.Model.extend({
  initialize: function (attrs) {
    console.log('This is the constructor of each instance of the model');
  },
  getName: function () {
    return this.get('name');
  },
  canAdmin: false
});

var Admin = User.extend({
  canAdmin: true
});

var myUser = new User({ name: 'My User' });
var myAdmin = new Admin({ name: 'My Admin' });

console.log(myAdmin,getName()); // My Admin
console.log(myUser.canAdmin) // false
console.log(myAdmin.canAdmin) // true
```

## <a name="models-with-mongoose"></a>Models with Mongoose

This is one of the best features on Rodejs.
If you define a schema in your model, it will be fully integrated with Mongoose.

```js
var rode = require('rode');

var User = rode.Model.extend({
  name: 'User',
  schema: {
    name: {
      type: 'String',
      unique: true
    },
    email: String,
    password: String
  }
});
```
You can extend this model, and their schema will be extended to.
Both models will share the same collection on MongoDB.
Documents of the extended models will have an attribute `_type` to differentiate.

```js
var Admin = User.extend({
  name: 'Admin',
  // The schema for admins is the schema for users + their own schema
  schema: {
    lastAccess: Date
  }
});
```

Now you can create some users and admins.
You can call any mongoose method on the model or their instances.


```js
var myUser = new User({
  name: 'Mariano',
  email: 'marian@example.com',
  password: 'my password'
});
var myAdmin = new Admin({
  name: 'Administrator',
  email: 'admin@example.com',
  password: 'my admin password',
  lastAccess: Date.now()
});

// Save the user on the collection
myUser.save(function (err) {

  // Save the admin on the collection
  myAdmin.save(function (err) {

    myUser.get('_id'); // Mongo ObjectId
  });
});
```

Now if you call a Mongoose method on a model, it will be executed on its owns docs.
For example, if you make a `find` on User Model it will return users and admins, but if you make a `find` on Admin Model, it will only return the admins

```js
// Find all, users and admins
User.find({}, function (err, users) {
  console.log(typeof users); // Array
  console.log(users[0] instanceof User); // true
});

// Find only the admins
Admin.find(function (err, admins) {
  console.log(typeof admins); // Array
  console.log(admins[0] instanceof Admin); // true
});
```

You can use any mongoose method!

## <a name="models-validators"></a>Models validators

Models support validators. You can use a custom validator as `string` or use a `function` for custom validations.
Let's see the examples:

```js
// Create an User Model and append all the validators
var User = rode.Model.extend({
  validators: {
    username: 'string',
    emailAddress: 'email',
    lastAccess: 'date',
    visits: 'number',
    password: function (password) {
      return password.length > 6 && password.length <= 16;
    }
  }
});

// Create two new instances of the model and insert data
var user1 = new User({
  username: 'marian2js',
  emailAddress: 'example.com',
  password: '123456'
});
var user2 = new User({
  username: 'bestUser',
  emailAddress: 'this is not an email'
});

console.log(user1.isValid()); // true
console.log(user2.isValid()); // false

var valid = user1.set('visits', 'many');
console.log(valid); // false
```

## <a name="controllers"></a>Controllers

Controllers and Routes work together to facilitate the routing of the application.

A controller looks like:

```js
var rode = require('rode');

var HelloController = {
  /**
   * sayHello Action
   */
  sayHello: function (req, res) {
    res.render('index', {
      title: 'Hello World!'
    });
  }
};

module.exports = HelloController;
```

And Route for this Controller looks like:

```js
var rode = require('rode');

var mainRouter = rode.getRouter('Main');

/**
 * Base Route for this Package (Optional)
 */
mainRouter.setBase('/');

/**
 * Responds to /hello with MainController.sayHello
 */
mainRouter.add({
  controller: 'Hello', // Defaults 'Main'
  pattern: 'hello',
  action: 'sayHello',
  method: 'get' // Defaults 'all'
});
```

## <a name="middleware-routes"></a>Middleware on Routes

Here's an example of how to define a middleware on routes:

```js
var UserController = {
  showPrivateData: [
    function (req, res, next) {
      // Check permissions
      next();
    },
    function (req, res) {
      // Show Private Data
    }
  ],
};
```

## <a name="restful-apis"></a>Restful APIs

Make a Restful API can not be more easy.
Create your package with the command:

    $ rode new-package PackageName --rest

Or add `productRouter.setRestApi('/api/products/');` on `routes.js`

Now you should create methods on your `RestController.js` following simple naming conventions.

Here are some examples:

```js
// [GET] /api/products
get: function (req, res) { ... }

// [POST] /api/products
post: function (req, res) { ... }

// [GET] /api/products/sponsored
getSponsored: function (req, res) { ... }

// [PUT] /api/products/sponsored
putSponsored: function (req, res) { ... }

// [POST] /api/products/sponsored/today
postSponsoredToday: function (req, res) { ... }

// [GET] /api/products/:id
getById: function (req, res) { ... }

// [POST] /api/products/:id
postById: function (req, res) { ... }

// [DELETE] /api/products/:id
deleteById: function (req, res) { ... }

// [GET] /api/products/:id/comments
getByIdComments: function (req, res) { ... }

// [PUT] /api/products/:id/comments/:id2
putByIdCommentsById: function (req, res) { ... }
```

You can create as many combinations as you like.
Remember that each package can have its own `RestController.js`


## <a name="tests"></a>Tests

You can run all the test with the command:

    $ grunt test


## <a name="templates-engines"></a>Templates engines

Rode supports all this templates engines:

* [Jade](http://jade-lang.com/) (default template)
* [Ejs](http://embeddedjs.com/) (using [ejs-locals](https://github.com/RandomEtc/ejs-locals))
* [Hogan.js](http://twitter.github.io/hogan.js/)
* [Google Closure Templates](https://developers.google.com/closure/templates/)
* Since you still can use express, you can use any template that express support

