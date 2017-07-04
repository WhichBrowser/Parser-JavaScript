/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Tablet {
  static detectTablet(ua) {
    Tablet.detectWebTab.call(this, ua);
  }

  /* WeTab */
  static detectWebTab(ua) {
    if (/WeTab-Browser /iu.test(ua)) {
      this.data.device.manufacturer = 'WeTab';
      this.data.device.model = 'WeTab';
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.TABLET;
      this.data.browser.name = 'WebTab Browser';
      this.data.browser.version = null;
      this.data.os.name = 'MeeGo';
      this.data.os.version = null;
    }
  }
}

module.exports = Tablet;
