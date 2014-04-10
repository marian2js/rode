var path = require('path');
var expect = require('expect.js');
import { ViewEngine } from '../ViewEngine';

describe('ViewEngine', () => {
  var viewEngine;
  var fakeExpressApp;
  var views;

  /**
   * Create a viewEngine with a fake Express app
   */
  beforeEach(() => {
    fakeExpressApp = new Map();
    views = {
      path: path.join(__dirname, 'views'),
      engine: 'jade'
    };
    viewEngine = new ViewEngine(fakeExpressApp, views);
  });

  /**
   * Test if the view engine configs express
   */
  it('should config view engine on express', () => {
    viewEngine.config();
    expect(fakeExpressApp.get('views')).to.be(views.path);
    expect(fakeExpressApp.get('view engine')).to.be(views.engine);
  });

});