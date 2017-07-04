/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Signage {
  static detectSignage(ua) {
    let match;
    if (!/(BrightSign|ADAPI)/iu.test(ua)) {
      return;
    }
    /* BrightSign */
    if ((match = /BrightSign\/[0-9.]+(?:-[a-z0-9-]+)? \(([^)]+)/u.exec(ua))) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'BrightSign',
        model: match[1],
        type: Constants.deviceType.SIGNAGE,
      });
    }
    /* Iadea */
    if (/ADAPI/u.test(ua) && (match = /\(MODEL:([^)]+)\)/u.exec(ua))) {
      if (!this.data.isOs('Android')) {
        this.data.os.reset();
      }
      this.data.device.setIdentification({
        manufacturer: 'IAdea',
        model: match[1],
        type: Constants.deviceType.SIGNAGE,
      });
    }
  }
}

module.exports = Signage;
