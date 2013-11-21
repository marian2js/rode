RodeJS
====

Smart Packet-Oriented Boilerplate for [Express](http://expressjs.com) and [Mongoose](http://mongoosejs.com).

## Quick Start

Install Rode set up your boilerplate:

    $ npm install -g rode bower grunt-cli
    $ rode generate --sessions --css stylus --ejs myapp

Install dependencies:

    $ npm install

Start the server:

    $ node app


Usage of `rode generate` is the same that [Express](http://expressjs.com)

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


## Packages

A package (or bundle) is a component of your application with its own MVC.

You can simply create a new package with the command:

    $ rode new:package PackageName


## Models

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

## Models with Mongoose

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

## Controllers

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

## Tests

You can run all the test with the command:

    $ grunt test


## Templates engines

Rode supports all this templates engines:

* [Jade](http://jade-lang.com/) (default template)
* [Ejs](http://embeddedjs.com/)
* [Hogan.js](http://twitter.github.io/hogan.js/)
* [Google Closure Templates](https://developers.google.com/closure/templates/)

