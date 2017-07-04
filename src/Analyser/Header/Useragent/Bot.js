/* eslint-disable require-jsdoc */

const Constants = require('../../../constants');
const Applications = require('../../../data/Applications');

class Bot {
  static detectBot(ua) {
    /* Detect bots based on url in the UA string */
    if (/\+https?:\/\//iu.test(ua)) {
      this.data.browser.reset();
      this.data.os.reset();
      this.data.engine.reset();
      this.data.device.reset();
      this.data.device.type = Constants.deviceType.BOT;
    }
    /* Detect bots based on common markers */
    if (/(?:Bot|Robot|Spider|Crawler)([/);]|$)/iu.test(ua) && !/CUBOT/iu.test(ua)) {
      this.data.browser.reset();
      this.data.os.reset();
      this.data.engine.reset();
      this.data.device.reset();
      this.data.device.type = Constants.deviceType.BOT;
    }
    /* Detect based on a predefined list or markers */
    const bot = Applications.identifyBot(ua);
    if (bot) {
      this.data.browser = bot;
      this.data.os.reset();
      this.data.engine.reset();
      this.data.device.reset();
      this.data.device.type = Constants.deviceType.BOT;
    }
    return this;
  }
}

module.exports = Bot;
