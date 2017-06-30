const Darwins = require('../../data/os-darwin');
/**
 * Darwin utility
 *
 * @internal
 */
class Darwin {
  /**
   *
   * @param {string} platform
   * @param {string} version
   *
   * @return {object}
   */
  static getVersion(platform, version) {
    version = version.split('.').slice(0, 3).join('.');

    switch (platform) {
      case 'osx':
        return Darwin.OSK[version];
      case 'ios':
        return Darwin.IOS[version];
    }
  }
}
Darwin.OSK = Darwins.DARWIN.OSX;
Darwin.IOS = Darwins.DARWIN.IOS;

module.exports = Darwin;
