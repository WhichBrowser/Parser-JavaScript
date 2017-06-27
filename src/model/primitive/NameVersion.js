const Base = require('./Base');
const Version = require('../Version');
/**
 * Class representing a NameVersion.
 * @extends Base
 */
class NameVersion extends Base {
  /**
   * Set the properties to the default values
   *
   * @param   {Object|null}  properties  An optional object of properties to set after setting it to the default values
   *
   * @internal
   */
  reset(properties = null) {
    this.name = null;
    this.alias = null;
    this.version = null;
    properties && this.set(properties);
  }


  /**
   * Identify the version based on a pattern
   *
   * @param   {RegExp}      pattern   The regular expression that defines the group that matches the version string
   * @param   {string}      subject   The string the regular expression is matched with
   * @param   {Object|null}  defaults  An optional array of properties to set together with the value
   *
   */
  identifyVersion(pattern, subject, defaults = {}) {
    let match;
    let version;
    if ((match = pattern.exec(subject) ) !== null) {
      version = match[1];

      if (defaults.type) {
        switch (defaults.type) {
          case 'underscore':
            version = version.replace(/_/g, '.');
            break;
          case 'legacy':
            version = version.replace(/([0-9])([0-9])/, '$1.$2');
            break;
        }
      }

      this.version = new Version(Object.assign({}, defaults, {value: version}));
    }
  }


  /**
   * Get the name in a human readable format
   *
   * @return {string}
   */
  getName() {
    return this.alias || this.name || '';
  }


  /**
   * Get the version in a human readable format
   *
   * @return {string}
   */
  getVersion() {
    return this.version ? this.version.toString() : '';
  }


  /**
   * Is a name detected?
   *
   * @return {boolean}
   */
  isDetected() {
    return !!this.name;
  }


  /**
   * Get the name and version in a human readable format
   *
   * @return {string}
   */
  toString() {
    return `${this.getName()} ${this.version && !this.version.hidden ? this.getVersion() : ''}`.trim();
  }
}

module.exports = NameVersion;
