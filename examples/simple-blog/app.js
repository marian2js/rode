require('./setup');
var rode = require('rode');
var bodyParser = require('body-parser');

/*********************************************
 * WARNING: This is file does not support ES6
 *********************************************/

/**
 * [Optional] Config your app using Express
 *
 * @param app = express()
 */
rode.config(function (app) {
  app.use(bodyParser());
});

/**
 * Run the server (by default on localhost:3000)
 */
rode.run()
  .then(function () {
    console.log('Server started on ' + rode.env + '!');
  })
  .catch(function (err) {
    console.error(err);
  });