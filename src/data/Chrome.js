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
        return Chrome.DESKTOP[version];
      case 'mobile':
        return Chrome.MOBILE[version];
    }

    // return 'canary';
  }
}
Chrome.DESKTOP = chromeVersions.DESKTOP;
Chrome.MOBILE = chromeVersions.MOBILE;

module.exports = Chrome;
