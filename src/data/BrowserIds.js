/**
 * BrowserIds utility
 *
 * @internal
 */
class BrowserIds {
  /**
   *
   * @param {string} model
   *
   * @return {string|undefined}
   */
  static identify(model) {
    return BrowserIds.ANDROID_BROWSERS[model];
  }
}
BrowserIds.ANDROID_BROWSERS = require('../../data/id-android').ANDROID_BROWSERS;

module.exports = BrowserIds;
