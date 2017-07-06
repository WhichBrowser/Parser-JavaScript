const NameVersion = require('./primitive/NameVersion');
/**
 * @internal
 */
class Engine extends NameVersion {
  /**
   * Get an object with all defined properties
   *
   * @internal
   *
   * @return {object|string}
   */
  toObject() {
    const result = {};

    if (this.name) {
      result.name = this.name;
    }

    let versionObj;
    if (this.version && Object.keys((versionObj = this.version.toObject())).length) {
      result.version = versionObj;
    }

    return result;
  }
}

module.exports = Engine;
