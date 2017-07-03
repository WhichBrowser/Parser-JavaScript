/* eslint-disable require-jsdoc */

const Using = require('../../model/Using');
const Version = require('../../model/Version');
const Constants = require('../../constants');
const BrowserIds = require('../../data/BrowserIds');

class BrowserId {
  constructor(header, data = {browser: {}}) {
    if (header === 'XMLHttpRequest') {
      return;
    }

    this.data = data;

    /* The X-Requested-With header is send by the WebView, so our browser name is Chrome it is probably the Chromium WebView which is sometimes misidentified. */

    if (this.data.browser.name && this.data.browser.name === 'Chrome') {
      const version = this.data.browser.getVersion();

      this.data.browser.reset();
      this.data.browser.using = new Using({
        name: 'Chromium WebView',
        version: new Version({value: version.split('.')[0]}),
      });
    }

    /* Detect the correct browser based on the header */

    const browser = BrowserIds.identify(header);
    if (browser) {
      if (!this.data.browser.name) {
        this.data.browser.name = browser;
      } else {
        if (!this.data.browser.name.startsWith(browser)) {
          this.data.browser.name = browser;
          this.data.browser.version = null;
          this.data.browser.stock = false;
        } else {
          this.data.browser.name = browser;
        }
      }
    }

    /* The X-Requested-With header is only send from Android devices */

    if (
      !this.data.os.name ||
      (this.data.os.name !== 'Android' && (!this.data.os.family || this.data.os.family.getName() !== 'Android'))
    ) {
      this.data.os.name = 'Android';
      this.data.os.alias = null;
      this.data.os.version = null;

      this.data.device.manufacturer = null;
      this.data.device.model = null;
      this.data.device.identified = Constants.id.NONE;

      if (
        this.data.device.type !== Constants.deviceType.MOBILE &&
        this.data.device.type !== Constants.deviceType.TABLET
      ) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }
    }

    /* The X-Requested-With header is send by the WebKit or Chromium Webview */

    if (!this.data.engine.name || (this.data.engine.name !== 'Webkit' && this.data.engine.name !== 'Blink')) {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
    }
  }
}

module.exports = BrowserId;
