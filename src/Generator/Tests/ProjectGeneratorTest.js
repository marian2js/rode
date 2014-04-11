var expect = require('expect.js');
var path = require('path');
var fs = require('extfs');
import { ProjectGenerator } from '../ProjectGenerator';

describe('ProjectGenerator', () => {
  var projectName = 'FakeProject';
  var projectPath = path.join(__rodeBase, `tmp/${projectName}`);
  var filesPath = path.join(__rodeBase, 'bin/files');
  var acceptedVersion = '0.3.x';
  var projectGenerator;

  /**
   * Creates a new Package and PackageGenerator
   */
  beforeEach(() => projectGenerator = new ProjectGenerator(projectPath, filesPath, acceptedVersion));

  /**
   * Removes the content of the temporal folder
   */
  afterEach(() => {
    if (fs.existsSync(projectPath)) {
      fs.removeSync(projectPath);
    }
  });

  /**
   * Test if the configuration files are created correctly
   */
  it('should generate the configuration files', () => {
    projectGenerator.createConfigs('jade', 'css');
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'config/config.json'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'config/development.json'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'config/production.json'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'config/test.json'))).to.be(true);
  });

  /**
   * Test if the files of the main package are created correctly
   */
  it('should generate the main package', () => {
    projectGenerator.createMainPackage();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'src/Main/Controller/MainController.js'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'src/Main/Model/Main.js'))).to.be(true);
  });

  /**
   * Test if the main files are created correctly
   */
  it('should generate the main files', () => {
    projectGenerator.createMainFiles();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'app.js'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'setup.js'))).to.be(true);
  });

  /**
   * Test if the style files are created correctly
   */
  it('should generate the style files', () => {
    projectGenerator.createStyles();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'public/css/style.css'))).to.be(true);
  });

  /**
   * Test if package.json is created correctly
   */
  it('should generate package.json', () => {
    projectGenerator.createPackageJSON();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'package.json'))).to.be(true);
  });

  /**
   * Test if Gruntfile.js is created correctly
   */
  it('should generate Gruntfile.js', () => {
    projectGenerator.createGruntFiles();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'Gruntfile.js'))).to.be(true);
  });

  /**
   * Test if bower files are created correctly
   */
  it('should generate Bower files', () => {
    projectGenerator.createBowerFiles();
    expect(fs.existsSync(projectPath)).to.be(true);
    expect(fs.existsSync(path.join(projectPath, 'bower.json'))).to.be(true);
    expect(fs.existsSync(path.join(projectPath, '.bowerrc'))).to.be(true);
  });

});