/* eslint-disable require-jsdoc */

const Constants = require('../../constants');

class UCBrowserOld {
  constructor(header, data) {
    const Parser = require('../../Parser');
    this.data = data;

    if (this.data.device.type === Constants.deviceType.DESKTOP) {
      this.data.device.type = Constants.deviceType.MOBILE;

      this.data.os.reset();
    }

    if (!this.data.browser.name || this.data.browser.name !== 'UC Browser') {
      this.data.browser.name = 'UC Browser';
      this.data.browser.version = null;
    }

    this.data.browser.mode = 'proxy';
    this.data.engine.reset({name: 'Gecko'});

    const extra = new Parser({headers: {'User-Agent': header}});

    if (extra.device.type !== Constants.deviceType.DESKTOP) {
      if (extra.os.getName() !== '' && (this.data.os.getName() === '' || extra.os.getVersion() !== '')) {
        this.data.os = extra.os;
      }
      if (extra.device.identified) {
        this.data.device = extra.device;
      }
    }
  }
}

module.exports = UCBrowserOld;
