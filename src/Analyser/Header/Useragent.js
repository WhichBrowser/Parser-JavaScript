/* eslint-disable require-jsdoc */

const {Application, Bot, Browser, Device, Engine, Os, Using} = require('./Useragent/');

class Useragent {
  constructor(header, data, options) {
    this.data = data;
    this.options = options;
    /* Make sure we do not have a duplicate concatenated useragent string */

    header = header.replace(/^(Mozilla\/[0-9]\.[0-9].{20,})\s+Mozilla\/[0-9]\.[0-9].*$/iu, '$1');
    /* Detect the basic information */
    Os.detectOperatingSystem.call(this, header);
    Device.detectDevice.call(this, header);
    Browser.detectBrowser.call(this, header);
    Application.detectApplication.call(this, header);
    Using.detectUsing.call(this, header);
    Engine.detectEngine.call(this, header);
    /* Detect bots */
    if (!this.options.detectBots || this.options.detectBots === true) {
      Bot.detectBot.call(this, header);
    }
    /* Refine some of the information */
    Browser.refineBrowser.call(this, header);
    Os.refineOperatingSystem.call(this, header);
  }

  static removeKnownPrefixes(ua) {
    ua = ua.replace(/^OneBrowser\/[0-9.]+\//, '');
    ua = ua.replace(/^MQQBrowser\/[0-9.]+\//, '');
    return ua;
  }
}

module.exports = Useragent;
