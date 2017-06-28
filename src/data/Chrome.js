const chromeVersions = require('../../data/browsers-chrome.js');
/**
 * Chrome utility
 *
 * @internal
 */
class Chrome {
  /**
   *
   * @param {string} platform
   * @param {string} version
   *
   * @return {string}
   */
  static getChannel(platform, version) {
    version = version.split('.').slice(0, 3).join('.');

    switch (platform) {
      case 'desktop':
        if (Chrome.DESKTOP[version]) {
          return Chrome.DESKTOP[version];
        }
        break;
      case 'mobile':
        if (Chrome.MOBILE[version]) {
          return Chrome.MOBILE[version];
        }
        break;
    }

    return 'canary';
  }
}
Chrome.DESKTOP = chromeVersions.DESKTOP;
Chrome.MOBILE = chromeVersions.MOBILE;

module.exports = Chrome;