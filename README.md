rode.js
====

Packet-Oriented Framework for [ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) and [Express](http://expressjs.com).

##Table of Contents:

- [ECMAScript 6](#es6)
- [Getting started](#getting-started)
- [Packages](#packages)
- [Models](#models)
- [Controllers](#controllers)
- [Routes](#routes)
- [Middleware on Routes](#middleware-routes)
- [Restful APIs](#restful-apis)
- [Templates engines](#templates-engines)
- [Tests](#tests)


## <a name="es6"></a>ECMAScript 6

rode.js framework is a stable way to use [ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) today.
[ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts) support is provided by [traceur](https://npmjs.org/package/traceur), [es6-shim](https://npmjs.org/package/es6-shim) and [es6-module-loader](https://npmjs.org/package/es6-module-loader).
rode.js is based on [Express](http://expressjs.com), but we not rewrite it, you can still using all the [features of Express](http://expressjs.com/3x/api.html).


## <a name="getting-started"></a>Getting started

Install rode.js globally and generate a new project:

    # npm install -g rode
    $ rode new --view ejs --css less --sessions myProject

Install project dependencies:

    $ npm install

Start the server:

    $ node app

Usage of `rode new`:

    Usage: rode new [options] [dir]

    Options:

      -h, --help          output usage information
      -V, --version       output the version number
      -v, --view          add view engine support (jade|ejs|hogan|soy) (defaults to jade)
      -c, --css           add stylesheet support (less|stylus|css) (defaults to plain css)


## <a name="packages"></a>Packages

A package (or bundle) is a component of your application with its own MVC.

You can simply create a new package with the command:

    $ rode generate PackageName

    Usage: rode generate package <package>

    Options:

      -h, --help   output usage information
      -r, --rest   config rest api for this package
      -f, --force  force on existing package


## <a name="models"></a>Models

In a model you should add all your business logic:

```js
export class MyModel {

  /**
   * Sample method, converts a string to upper case
   */
  sampleMethod(str) {
    return str.toUpperCase();
  }

}
```

You can generate a Model `myModel` for a package `User` with the command:

    $ rode generate User:model myModel


## <a name="controllers"></a>Controllers

Controllers and Routes works together to facilitate the routing of the application.

A controller looks like:

```js
export class HelloController {

  /**
   * sayHello Action
   */
  sayHello(req, res) {
    res.render('index', {
      title: 'Hello World!'
    });
  }

}
```

You can generate a Controller `myController` for a package `User` with the command:

    $ rode generate User:controller myController


## <a name="routes"></a>Routes

A route for the above controller looks like:

```js
import { Router } from 'rode/loader';
var router = new Router();

/**
 * [GET] /
 * Calls HelloController.sayHello
 */
router.add({
  controller: 'Hello', // defaults 'Main'
  pattern: '/hello',
  action: 'sayHello',
  method: 'GET' // defaults 'GET'
});

export {router};
```


## <a name="middleware-routes"></a>Middleware on Routes

Here's an example of how to define a middleware on routes:

```js
export class UserController {
  showPrivateData() {
    return [
      (req, res, next) => {
        // Check permissions
        next();
      },
      (req, res) => {
        // Show Private Data
      }
    ];
  }
}
```


## <a name="restful-apis"></a>Restful APIs

Make a Restful API can not be more easy.
Create your package with the command:

    $ rode generate package PackageName --rest

Or add `router.restApi = '/api/products';` on `routes.js`

Now you should create methods on your `RestController.js` following simple naming conventions.

Here are some examples:

```js
// [GET] /api/products
get(req, res) { ... }

// [POST] /api/products
post(req, res) { ... }

// [GET] /api/products/sponsored
getSponsored(req, res) { ... }

// [PUT] /api/products/sponsored
putSponsored(req, res) { ... }

// [POST] /api/products/sponsored/today
postSponsoredToday(req, res) { ... }

// [GET] /api/products/:id
getById(req, res) { ... }

// [POST] /api/products/:id
postById(req, res) { ... }

// [DELETE] /api/products/:id
deleteById(req, res) { ... }

// [GET] /api/products/:id/comments
getByIdComments(req, res) { ... }

// [PUT] /api/products/:id/comments/:id2
putByIdCommentsById(req, res) { ... }
```

You can create as many combinations as you like.
Remember that each package can have its own `RestController.js`


## <a name="templates-engines"></a>Templates engines

rode.js supports all this templates engines:

* [Jade](http://jade-lang.com/) (default template)
* [Ejs](http://embeddedjs.com/) (using [ejs-locals](https://github.com/RandomEtc/ejs-locals))
* [Hogan.js](http://twitter.github.io/hogan.js/)
* [Google Closure Templates](https://developers.google.com/closure/templates/)
* Since you still can use express, you can use any template that express support


## <a name="tests"></a>Tests

You can run the test with the command:

    $ grunt test