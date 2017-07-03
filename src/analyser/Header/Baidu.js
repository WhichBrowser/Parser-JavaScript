/* eslint-disable require-jsdoc */
/**
 * Class for baidu detection
 */
class Baidu {
  constructor(header, data = {browser: {}}) {
    this.data = data;
    if (!this.data.browser.name || this.data.browser.name !== 'Baidu Browser') {
      this.data.browser.name = 'Baidu Browser';
      this.data.browser.version = null;
      this.data.browser.stock = false;
    }
  }
}

module.exports = Baidu;
