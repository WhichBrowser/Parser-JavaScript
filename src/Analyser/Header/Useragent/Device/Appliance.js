/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Appliance {
  static detectAppliance(ua) {
    Appliance.detectIOpener.call(this, ua);
    Appliance.detectWebLight.call(this, ua);
  }

  /* Netpliance i-Opener */
  static detectIOpener(ua) {
    if (/I-Opener [0-9.]+; Netpliance/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Netpliance',
        model: 'i-Opener',
        type: Constants.deviceType.DESKTOP,
      });
    }
  }

  /* KOMATSU WebLight */
  static detectWebLight(ua) {
    if (/KOMATSU.*WL\//u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'KOMATSU',
        model: 'WebLight',
        type: Constants.deviceType.DESKTOP,
      });
    }
  }
}

module.exports = Appliance;
