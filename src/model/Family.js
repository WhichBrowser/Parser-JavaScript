const NameVersion = require('./primitive/NameVersion');
/**
 * @internal
 */
class Family extends NameVersion {
  /**
   * Get an object with all defined properties
   *
   * @internal
   *
   * @return {object|string}
   */
  toObject() {
    const result = {};
    if (this.name && !this.version) {
      return this.name;
    }

    if (this.name) {
      result.name = this.name;
    }

    if (this.version) {
      result.version = this.version.toObject();
      if (typeof result.version === 'string' && !result.version.includes('.')) {
        result.version = Number(result.version);
      }
    }

    return result;
  }
}

module.exports = Family;
