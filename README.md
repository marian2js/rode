RodeJS
====

Smart Packet-Oriented Boilerplate for [Express](http://expressjs.com) and [Mongoose](http://mongoosejs.com).

## Quick Start

Install Rode set up your boilerplate:

    $ npm install -g rode
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
      -J, --jshtml        add jshtml engine support (defaults to jade)
      -H, --hogan         add hogan.js engine support
      -c, --css           add stylesheet  support (less|stylus) (defaults to plain css)
      -f, --force         force on non-empty directory


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

```js
var rode = require('rode');

var Model = rode.getBaseModel();

// Define Person Model and Schema
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

// Define Employee Model and Schema extending Person
var Employee = Person.extend({
  name: 'Employee'
});
Employee.setSchema({
  company: 'String'
});

// Create same persons
var john = new Person.model({
  name: 'John',
  age: 40
});
var mariano = new Employee.model({
  name: 'Mariano Pardo',
  age: '22',
  company: 'Codexar'
});

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