/* eslint-disable require-jsdoc */

const Constants = require('../../constants');
const DeviceProfiles = require('../../data/DeviceProfiles');

class Wap {
  constructor(header, data) {
    this.data = data;
    header = header.trim();
    if (header.startsWith('"')) {
      header = header.split(',');
      header = header[0].replace(/^"+/, '').replace(/"+$/, '');
    }
    const result = DeviceProfiles.identify(header);
    if (result) {
      this.data.device.manufacturer = result[0];
      this.data.device.model = result[1];
      this.data.device.identified |= Constants.id.MATCH_PROF;
      if (result[2] && (!this.data.os.name || this.data.os.name !== result[2])) {
        this.data.os.name = result[2];
        this.data.os.version = null;
        this.data.engine.name = null;
        this.data.engine.version = null;
      }
      if (result[3]) {
        this.data.device.type = result[3];
      }
    }
  }
}

module.exports = Wap;
