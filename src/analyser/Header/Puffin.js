/* eslint-disable require-jsdoc */

const DeviceModels = require('../../data/DeviceModels');

class Puffin {
  constructor(header, data) {
    this.data = data;
    const parts = header.split('/');
    if (this.data.browser.name !== 'Puffin') {
      this.data.browser.name = 'Puffin';
      this.data.browser.version = null;
      this.data.browser.stock = false;
    }
    this.data.device.type = 'mobile';
    let device;
    if (parts.length > 1 && parts[0] === 'Android') {
      if (!this.data.os.name || this.data.os.name !== 'Android') {
        this.data.os.name = 'Android';
        this.data.os.version = null;
      }
      device = DeviceModels.identify('android', parts[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    if (parts.length > 1 && parts[0] === 'iPhone OS') {
      if (!this.data.os.name || this.data.os.name !== 'iOS') {
        this.data.os.name = 'iOS';
        this.data.os.version = null;
      }
      device = DeviceModels.identify('ios', parts[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
  }
}

module.exports = Puffin;
