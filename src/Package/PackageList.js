var path = require('path');
var fs = require('extfs');
var _ = require('underscore');
import { Package } from './Package';
import { Core } from '../Core/Core';
import { List } from '../Util/List';

export class PackageList {

  constructor() {
    this.list = new List;
  }

  /**
   * Promise a list with the packages of the app
   *
   * @return {Promise.<List>}
   */
  getAll() {
    return new Promise((resolve, reject) => {
      if (!this.list.isEmpty()) {
        resolve(this.list);
        return;
      }
      var srcPath = Core.instance.getPath('src');
      fs.getDirs(srcPath, (err, files) => {
        if (err) {
          reject(err);
          return;
        }
        files.forEach(file => this._addPackageToList(file, srcPath));
        resolve(this.list);
      });
    });
  }

  /**
   * Returns a list with the packages of the app
   *
   * @return {List.<Package>}
   */
  getAllSync() {
    if (!this.list.isEmpty()) {
      return this.list;
    }
    var srcPath = Core.instance.getPath('src');
    var packs = fs.getDirsSync(srcPath);
    packs.forEach(file => this._addPackageToList(file, srcPath));
    return this.list;
  }

  /**
   * Add a package to the list
   *
   * @param {string} file
   * @param {string} srcPath
   * @private
   */
  _addPackageToList(file, srcPath) {
    var filePath = path.join(srcPath, file);
    this.list.add(new Package(file, filePath));
  }
}