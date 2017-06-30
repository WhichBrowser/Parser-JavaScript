/**
 * DeviceProfiles utility
 *
 * @internal
 */
class DeviceProfiles {
  /**
   *
   * @param {url} url
   *
   * @return {string|undefined}
   */
  static identify(url) {
    return DeviceProfiles.PROFILES[url] || false;
  }
}
DeviceProfiles.PROFILES = require('../../data/profiles').PROFILES;

module.exports = DeviceProfiles;
