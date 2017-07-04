/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Phone {
  static detectPhone(ua) {
    Phone.detectNttTeless.call(this, ua);
  }

  /* Casio */
  static detectNttTeless(ua) {
    if (/Product=NTT\/Teless/iu.test(ua)) {
      this.data.device.manufacturer = 'NTT';
      this.data.device.model = 'Teless';
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.subtype = Constants.deviceSubType.DESKTOP;
    }
  }
}

module.exports = Phone;
