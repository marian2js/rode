var S = require('string');

export class Template {

  constructor(str) {
    this.str = str;
  }

  /**
   * Render the variables between double curly braces
   *
   * i.e: {{ name }} -> vars['name']
   *      {{ name | toLowerCase }} -> vars['name'].toLowerCase()
   *
   * @param vars
   * @returns {string}
   * @private
   */
  render(vars) {
    var regex = /\{{2}([^}]+)\}{2}/g;
    this.str = this.str.replace(regex, (match, value) => {
      var parts = value.split('|');
      var result;
      value = parts[0].trim();
      result = vars[value] || '';
      if (parts[1] && parts[1].trim()) {
        result = result[parts[1].trim()]();
      }
      return result;
    });
    return this.str;
  }

  /**
   * Helper for strings in templates, extends from string.js
   *
   * @param {string} value
   * @private
   */
  static ExtendString(value) {
    this.setValue(value);

    /**
     * Returns the string with the first letter in upper case
     *
     * @return {Template.ExtendString}
     */
    this.capitalize = function () {
      return new Template.ExtendString(value[0].toUpperCase() + value.slice(1));
    };

    /**
     * Returns the string with the first letter in lower case
     *
     * @return {Template.ExtendString}
     */
    this.camelize = function () {
      return new Template.ExtendString(value[0].toLowerCase() + value.slice(1));
    };
  }
}

// _templateVar extends from string.js
Template.ExtendString.prototype = S();
Template.ExtendString.prototype.constructor = Template.ExtendString;