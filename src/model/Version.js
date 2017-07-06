const Base = require('./primitive/Base');
/**
 * Class representing a Version.
 * @extends Base
 */
class Version extends Base {
  /**
   * constructor
   *
   * @param {object} [properties]
   * @param {string|number} [properties.value] The version value
   * @param {boolean} [properties.hidden=false] define if the version is hidden
   * @param {string} [properties.nickname] define the version nickname
   * @param {string} [properties.alias] define the version alias
   * @param {number} [properties.details] define the details value
   * @param {boolean} [properties.builds] define the details value
   *
   * @internal
   */
  constructor(properties = {}) {
    if (properties.value) {
      properties.value = '' + properties.value;
    }
    super(Object.assign({}, {hidden: false}, properties));
  }

  /**
   * Determine if the version is lower, equal or higher than the specified value
   *
   * @param {string}        operator   The operator, must be <, <=, =, >= or >
   * @param {number|string} [compare]    The value, can be an integer, float or string with a version number
   *
   * @return {boolean}
   */
  is(operator, compare) {
    let valid = false;
    if (operator) {
      if (!compare) {
        compare = operator;
        operator = '=';
      }
      compare = '' + compare;
      const regExp = /\./;
      const min = Math.min((regExp.exec(this.value) || []).length, (regExp.exec(compare) || []).length) + 1;
      const v1 = this.toValue(this.value, min);
      const v2 = this.toValue(compare, min);
      switch (operator) {
        case '<':
          valid = v1 < v2;
          break;
        case '<=':
          valid = v1 <= v2;
          break;
        case '=':
          valid = v1 === v2;
          break;
        case '>':
          valid = v1 > v2;
          break;
        case '>=':
          valid = v1 >= v2;
          break;
      }
    }
    return valid;
  }

  /**
   * Return an object with each part of the version number
   *
   * @return {object}
   */
  getParts() {
    const parts = this.value.split('.');
    return {
      major: Number(parts[0] || 0),
      minor: Number(parts[1] || 0),
      patch: Number(parts[2] || 0),
    };
  }

  /**
   * Return the major version as an integer
   *
   * @return {number}
   */
  getMajor() {
    return this.getParts().major;
  }

  /**
   * Return the minor version as an integer
   *
   * @return {number}
   */
  getMinor() {
    return this.getParts().minor;
  }

  /**
   * Return the patch number as an integer
   *
   * @return {number}
   */
  getPatch() {
    return this.getParts().patch;
  }

  /**
   * Convert a version string seperated by dots into a float that can be compared
   *
   * @internal
   *
   * @param {string} value   Version string, with elements seperated by a dot
   * @param {number} count   The maximum precision
   *
   * @return {number}
   */
  toValue(value = '', count = NaN) {
    if (!value) {
      value = this.value;
    }
    let parts = value.split('.');
    if (!isNaN(count)) {
      parts = parts.slice(0, count);
    }
    let result = parts[0];
    if (parts.length > 1) {
      result += '.';
      count = parts.length;
      for (let p = 1; p < count; p++) {
        let tempString = `0000${parts[p]}`;
        result += tempString.substr(tempString.length - 4);
      }
    }
    return Number(result);
  }

  /**
   * Return the version as a float
   *
   * @return {number}
   */
  toFloat() {
    return parseFloat(this.value);
  }

  /**
   * Return the version as an integer
   *
   * @return {int}
   */
  toNumber() {
    return parseInt(this.value, 10);
  }

  /**
   * Return the version as a human readable string
   *
   * @return {string}
   */
  toString() {
    if (this.alias) {
      return this.alias;
    }
    let version = '';
    if (this.nickname) {
      version = `${this.nickname} `;
    }
    if (this.value) {
      const matches = this.value.match(/([0-9]+)(?:\.([0-9]+))?(?:\.([0-9]+))?(?:\.([0-9]+))?(?:([ab])([0-9]+))?/);
      if (matches) {
        let v = [matches[1]];
        if (matches[2]) {
          v.push(matches[2]);
        }
        if (matches[3]) {
          v.push(matches[3]);
        }
        if (matches[4]) {
          v.push(matches[4]);
        }
        if (this.details) {
          if (this.details < 0) {
            v.splice(this.details, 0 - this.details);
          }
          if (this.details > 0) {
            v.splice(this.details, v.length - this.details);
          }
        }
        if (typeof this.builds !== 'undefined' && !this.builds) {
          const count = v.length;
          for (let i = 0; i < count; i++) {
            if (v[i] > 999) {
              v.splice(i, 1);
            }
          }
        }
        version += v.join('.');
        if (matches[5]) {
          version += `${matches[5]}${matches[6] || ''}`;
        }
      }
    }
    return version;
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
    if (this.value) {
      if (this.details) {
        const parts = this.value.split('.');
        if (this.details) {
          if (this.details < 0) {
            parts.splice(this.details, 0 - this.details);
          }
          if (this.details > 0) {
            parts.splice(this.details, parts.length - this.details);
          }
        }
        result.value = parts.join('.');
      } else {
        result.value = this.value;
      }
    }
    if (this.alias) {
      result.alias = this.alias;
    }
    if (this.nickname) {
      result.nickname = this.nickname;
    }
    if (result.value && !result.alias && !result.nickname) {
      return result.value;
    }
    return result;
  }
}

module.exports = Version;
