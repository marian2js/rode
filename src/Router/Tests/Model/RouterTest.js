var expect = require('expect.js'),
	rode = require('../../../../rode');

var Router = rode.getCoreModel('Router');
var pack = 'Router';

describe('Router', function () {
	it('should add new routes', function (done) {
		Router.removeAll(pack);
		Router.setBase(pack, '/routes');
		Router.add(pack, {
			pattern: 'a',
			action: 'action',
			method: 'get'
		});
		Router.add(pack, {
			pattern: '/b',
			action: 'otherAction',
			method: 'post'
		});
		expect(Router.routes[pack].length).to.equal(2);
		done();
	});

	it('should find any route', function (done) {
		var routes = Router.searchByAction(pack, 'action');
		expect(routes.length).to.equal(1);
		expect(routes[0]).to.be.ok();
		expect(routes[0].action).to.be('action');
		expect(routes[0].pattern).to.be('a');
		var emptyroutes = Router.searchByAction(pack, 'Not An Action');
		expect(emptyroutes).to.be.empty();
		done();
	});

	it('should generate correct path', function (done) {
		var pathA = Router.getPath(pack, 'action');
		var pathB = Router.getPath(pack, 'otherAction');
		expect(pathA).to.be('/routes/a');
		expect(pathB).to.be('/routes/b');
		done();
	});
});
