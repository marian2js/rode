var expect = require('expect.js');
import { PackageList } from '../PackageList';
import { Package } from '../Package';
import { List } from '../../Util/List';

describe('PackageList', () => {
  var packageList;

  beforeEach(() => packageList = new PackageList);

  describe('Get all the packages', () => {

    /**
     * Test if the list of packages is a valid one
     *
     * @param {List.<Package>} packs
     */
    var testPackages = function (packs) {
      expect(packs).to.be.a(List);
      expect(packs).to.have.length(3);
      expect(packs.get(0)).to.be.a(Package);

      // Check if the list has 'Package' and 'Package2'
      var hasPackage = packs.some(pack => pack.name === 'Package');
      var hasPackage2 = packs.some(pack => pack.name === 'Package2');
      expect(hasPackage).to.be(true);
      expect(hasPackage2).to.be(true);
    };

    it('should find the list of packages async', done => {
      packageList.getAll()
          .then(packs => {
            testPackages(packs);
            done();
          })
          .catch(err => {
            expect().fail(err);
            done();
          });
    });

    it('should find the list of packages sync', () => {
      var packs = packageList.getAllSync();
      testPackages(packs);
    });

  });

});
