var expect = require('expect.js');
import { Template } from '../Template';

describe('Template', () => {

  /**
   * Test if the template system works correctly
   */
  it('should render the variables inside a template', () => {
    var str = 'Hello {{ name }}! This is a {{ thing | toLowerCase }}.';
    var template = new Template(str);
    var vars = {
      name: 'World',
      thing: 'TEST'
    };
    str = template.render(vars);
    expect(str).to.be('Hello World! This is a test.');
  });

  /**
   * Test if the template does not render undefined variables
   */
  it('should not render something if the variable does not exist', () => {
    var str = 'This {{ variable }} does not exist';
    var template = new Template(str);
    str = template.render({});
    expect(str).to.be('This  does not exist');
  });

});