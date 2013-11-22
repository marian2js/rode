RodeJS
====

Smart Packet-Oriented Framework for [Express](http://expressjs.com) and [Mongoose](http://mongoosejs.com).

##Table of Contents:

- [Quick Start](#quick-start)
- [Packages](#packages)
- [Models](#models)
- [Models with Mongoose](#models-with-mongoose)
- [Controllers](#controllers)
- [Restful APIs With Rode](#restful-apis-with-rode)
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

    $ rode new:package PackageName

    Usage: rode new:package <package>

    Options:

      -h, --help   output usage information
      -r, --rest   config rest api for this package
      -f, --force  force on existing package


## <a name="models"></a>Models

Models on Rode are modules really extensibles.

```js
var rode = require('rode');

var Model = rode.getBaseModel();

var Person = Model.extend({
  name: 'Person',
  sayHello: function () {
    console.log('Hello Models!');
  }
});

var Employee = Person.extend({
  name: 'Employee'
});

Employee.sayHello(); // Hello Models!
```

## <a name="models-with-mongoose"></a>Models with Mongoose

In this example we first define Person Model and their Schema:

```js
var rode = require('rode');

var Model = rode.getBaseModel();

var Person = Model.extend({
  name: 'Person',
});
Person.setSchema({
  name: {
    type: 'String',
    unique: true
  },
  age: {
    type: 'Number',
    default: 0
  }
});
```

Now define Employee Model and their Schema extending from Person:

```js
var Employee = Person.extend({
  name: 'Employee'
});
Employee.setSchema({
  company: 'String'
});
```

You can create some persons and employees:

```js
var john = new Person.model({
  name: 'John',
  age: 40
});
var mariano = new Employee.model({
  name: 'Mariano Pardo',
  age: '22',
  company: 'Codexar'
});
```

And you can still using any mongoose method:

```js
// Save John on Persons
john.save(function (err) {
  // Save Mariano on Employees
  mariano.save(function (err) {
    // Get all persons (Persons + Employees)
    Person.getAll(function (err, persons) {
      console.log(persons);
      // You can access to Mongoose model
      Person.model.remove({});
    });
  });
});
```

We recommend having a single file for each model.

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

## <a name="restful-apis-with-rode"></a>Restful APIs With Rode

Make a Restful API can not be more easy.
Create your package with the command:

    $ rode new:package PackageName --rest

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
* [Ejs](http://embeddedjs.com/)
* [Hogan.js](http://twitter.github.io/hogan.js/)
* [Google Closure Templates](https://developers.google.com/closure/templates/)
* Since you still can use express, you can use any template that express support

