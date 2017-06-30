const Constants = require('../constants');
const {MANUFACTURERS: {TELEVISION, GENERIC}} = require('../../data/manufacturer-names');
/**
 * Manufacturers utility
 *
 * @internal
 */
class Manufacturers {
  /**
   *
   * @param {string} type
   * @param {string} name
   *
   * @return {string}
   */
  static identify(type, name) {
    name = name.trim().replace(/^CUS:/u, '');

    if (type === Constants.deviceType.TELEVISION) {
      if (Manufacturers.TELEVISION[name]) {
        return Manufacturers.TELEVISION[name];
      }
    }
    if (Manufacturers.GENERIC[name]) {
      return Manufacturers.GENERIC[name];
    }

    return name;
  }
}

Manufacturers.TELEVISION = TELEVISION;
Manufacturers.GENERIC = GENERIC;

module.exports = Manufacturers;
