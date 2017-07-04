/* eslint-disable require-jsdoc */

const Constants = require('../../constants');
const DeviceModels = require('../../data/DeviceModels');

class OperaMini {
  constructor(header, data) {
    this.data = data;
    const [manufacturer = '', model = ''] = header.split(' # ');
    if (manufacturer !== '?' && model !== '?') {
      if (this.data.device.identified < Constants.id.PATTERN) {
        if (this.identifyBasedOnModel(model)) {
          return;
        }
        this.data.device.manufacturer = manufacturer;
        this.data.device.model = model;
        this.data.device.identified = true;
      }
    }
  }

  identifyBasedOnModel(model) {
    let device = DeviceModels.identify('bada', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;
      if (!this.data.os.name || this.data.os.name !== 'Bada') {
        this.data.os.name = 'Bada';
        this.data.os.version = null;
      }
      return true;
    }
    device = DeviceModels.identify('blackberry', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;
      if (!this.data.os.name || this.data.os.name !== 'BlackBerry OS') {
        this.data.os.name = 'BlackBerry OS';
        this.data.os.version = null;
      }
      return true;
    }
    device = DeviceModels.identify('wm', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;
      if (!this.data.os.name || this.data.os.name !== 'Windows Mobile') {
        this.data.os.name = 'Windows Mobile';
        this.data.os.version = null;
      }
      return true;
    }
  }
}

module.exports = OperaMini;
