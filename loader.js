var path = require('path');
var fs = require('fs');
import { Core } from './src/Core/Core';
import { PackageList } from './src/Package/PackageList';
import { Package } from './src/Package/Package';
import { Router } from './src/Router/Router';
import { List } from './src/Util/List';
import { Observable } from './src/MVC/Observable';
import { InvalidParamsError } from './src/Error/InvalidParamsError';
import { FileExistsError } from './src/Error/FileExistsError';


// Find the app root path
var rootPath = path.resolve(__dirname, '../../');
var packageJson = path.resolve(rootPath, 'package.json');
if (!fs.existsSync(packageJson)) {
  rootPath = __dirname;
}

var core = new Core(rootPath);
core.packageList = new PackageList;

// for singletons export the instance
export var rode = core;
export var packageList = core.packageList;

// export all the public classes
export {Package};
export {Router};
export {List};
export {Observable};

// export common errors
export {InvalidParamsError};
export {FileExistsError};