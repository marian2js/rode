var path = require('path');
var expect = require('expect.js');
import { Router } from '../Router';
import { Package } from '../../Package/Package';

describe('Router', () => {
  var router;
  var route1 = {
    action: 'index',
    pattern: '/',
    method: 'get'
  };
  var route2 = {
    action: 'menu',
    pattern: '/menu',
    method: 'get'
  };

  beforeEach(() => router = new Router);

  it('should allow to add new routes', () => {
    router.add(route1);
    router.add(route2);
    expect(router).to.have.length(2);
    expect(router.get(0)).to.be(route1);
    expect(router.get(1)).to.be(route2);
  });

  describe('filter', () => {

    it('should filter a route by predicate', () => {
      router.add(route1);
      router.add(route2);
      var result = router.filter(route => route.action === 'index');
      expect(result[0]).to.be(route1);
    });

    it('should filter a route by action', () => {
      router.add(route1);
      router.add(route2);
      var result = router.filterByAction('menu');
      expect(result[0]).to.be(route2);
    });

    it('should filter a route by pattern', () => {
      router.add(route1);
      router.add(route2);
      var result = router.filterByPattern('/menu');
      expect(result[0]).to.be(route2);
    });

  });

  describe('find', () => {

    it('should find a route by predicate', () => {
      router.add(route1);
      router.add(route2);
      var result = router.find(route => route.action === 'index');
      expect(result).to.be(route1);
    });

    it('should find a route by action', () => {
      router.add(route1);
      router.add(route2);
      var result = router.findByAction('index');
      expect(result).to.be(route1);
    });

    it('should find a route by action', () => {
      router.add(route1);
      router.add(route2);
      var result = router.findByPattern('/');
      expect(result).to.be(route1);
    });

  });

  describe('rest routes', () => {

    it('should return the rest routes', () => {
      var packPath = path.join(__rodeBase, 'mockApp/src/Package2');
      var pack = new Package('Package2', packPath);
      var packRouter = pack.router;
      expect(packRouter.restRoutes).to.be.an(Array);
      packRouter.restRoutes.forEach(route => {
        expect(route.controller).to.be.ok();
        expect(route.pattern).to.be.ok();
        expect(route.action).to.be.ok();
        expect(route.method).to.be.ok();
      });
    });

    it('should not break if the package has no rest api', () => {
      var packPath = path.join(__rodeBase, 'mockApp/src/Package');
      var pack = new Package('Package2', packPath);
      var packRouter = pack.router;
      expect(packRouter.restRoutes).to.be.an(Array);
      expect(packRouter.restRoutes).to.be.empty();
    });

  });
});