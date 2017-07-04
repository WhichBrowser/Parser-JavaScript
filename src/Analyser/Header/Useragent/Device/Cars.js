/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Cars {
  static detectCars(ua) {
    if (!/Car/iu.test(ua)) {
      return;
    }
    Cars.detectTesla.call(this, ua);
  }

  /* Tesla S */
  static detectTesla(ua) {
    if (/QtCarBrowser/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Tesla',
        model: 'Model S',
        type: Constants.deviceType.CAR,
      });
    }
  }
}

module.exports = Cars;
