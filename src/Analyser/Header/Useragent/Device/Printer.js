/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Printer {
  static detectPrinter(ua) {
    if (!/(TASKalfa|CanonIJCL|IR-S|PrintSmart|EpsonHello)/iu.test(ua)) {
      return;
    }
    let match;
    /* TASKalfa */
    if ((match = /TASKalfa ([0-9A-Z]+)/iu.exec(ua))) {
      this.data.device.setIdentification({
        manufacturer: 'Kyocera',
        model: `TASKalfa ${match[1]}`,
        type: Constants.deviceType.PRINTER,
      });
    }
    /* Canon IJ */
    if (/CanonIJCL/iu.test(ua)) {
      this.data.device.setIdentification({
        manufacturer: 'Canon',
        model: 'IJ Printer',
        type: Constants.deviceType.PRINTER,
      });
    }
    /* Canon iR S */
    if (/IR-S/iu.test(ua)) {
      this.data.device.setIdentification({
        manufacturer: 'Canon',
        model: 'imageRUNNER',
        type: Constants.deviceType.PRINTER,
      });
    }
    /* HP Web PrintSmart */
    if (/HP Web PrintSmart/iu.test(ua)) {
      this.data.device.setIdentification({
        manufacturer: 'HP',
        model: 'Web PrintSmart',
        type: Constants.deviceType.PRINTER,
      });
    }
    /* Epson Hello */
    if (/EpsonHello\//iu.test(ua)) {
      this.data.device.setIdentification({
        manufacturer: 'Epson',
        model: 'Hello',
        type: Constants.deviceType.PRINTER,
      });
    }
  }
}

module.exports = Printer;
