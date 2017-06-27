const NameVersion = require('./primitive/NameVersion');
/**
 * @internal
 */
class Using extends NameVersion {
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
    }

    return result;
  }
}
module.exports = Using;
