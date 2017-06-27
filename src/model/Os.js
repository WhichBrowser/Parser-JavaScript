const NameVersion = require('./primitive/NameVersion');
/**
 * Class that represents an OS
 *
 * @internal
 */
class Os extends NameVersion {
  /**
   * constructor
   *
   * @param {object}  [properties] An optional object to set after setting it to the default values
   * @param {Family}  [properties.family]
   * @param {string}  [properties.edition]
   * @param {boolean} [properties.hidden=false]
   *
   * @internal
   */
  constructor(properties = {}) {
    super(Object.assign({}, {hidden: false}, properties));
  }

  /**
   * Set the properties to the default values
   *
   * @param   {Object|null}  properties  An optional object of properties to set after setting it to the default values
   *
   * @internal
   */
  reset(properties = null) {
    super.reset();
    this.family = null;
    this.edition = null;
    this.hidden = false;
    if (properties) {
      this.set(properties);
    }
  }

  /**
   * Return the name of the operating system family
   *
   * @return {string}
   */
  getFamily() {
    if (this.family) {
      return this.family.getName();
    }
    return this.getName();
  }

  /**
   * Is the operating from the specified family
   *
   * @param  {string}   name   The name of the family
   *
   * @return {boolean}
   */
  isFamily(name) {
    if (this.getName() === name) {
      return true;
    }
    if (this.family) {
      if (this.family.getName() === name) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the name and version in a human readable format
   *
   * @return {string}
   */
  toString() {
    if (this.hidden) {
      return '';
    }

    return `${this.getName()}${this.version && !this.version.hidden ?
      ` ${this.getVersion()}` :
      ''}${this.edition ? ` ${this.edition}` : ''}`.trim();
  }

  /**
   * Get an object with all defined properties
   *
   * @internal
   *
   * @return {object}
   */
  toObject() {
    const result = {};
    if (this.name) {
      result.name = this.name;
    }
    if (this.family) {
      result.family = this.family.toObject();
    }
    if (this.alias) {
      result.alias = this.alias;
    }
    if (this.edition) {
      result.edition = this.edition;
    }
    let versionObj;
    if (this.version && Object.keys(( versionObj = this.version.toObject())).length) {
      result.version = versionObj;
    }
    return result;
  }
}

module.exports = Os;
