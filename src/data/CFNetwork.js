const CFNetworks = require('../../data/os-cfnetwork');
/**
 * CFNetwork utility
 *
 * @internal
 */
class CFNetwork {
  /**
   *
   * @param {string} platform
   * @param {string} version
   *
   * @return {object}
   */
  static getVersion(platform, version) {
    switch (platform) {
      case 'osx':
        return CFNetwork.OSK[version];
      case 'ios':
        return CFNetwork.IOS[version];
    }
  }
}
CFNetwork.OSK = CFNetworks.CFNetwork.OSX;
CFNetwork.IOS = CFNetworks.CFNetwork.IOS;

module.exports = CFNetwork;
