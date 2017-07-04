/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Gps {
  static detectGps(ua) {
    if (!/Nuvi/iu.test(ua)) {
      return;
    }

    Gps.detectGarmin.call(this, ua);
  }

  /* Garmin Nuvi */
  static detectGarmin(ua) {
    if (/Nuvi/u.test(ua) && /Qtopia/u.test(ua)) {
      this.data.device.setIdentification({
        manufacturer: 'Garmin',
        model: 'Nuvi',
        type: Constants.deviceType.GPS,
      });
    }
  }
}

module.exports = Gps;
