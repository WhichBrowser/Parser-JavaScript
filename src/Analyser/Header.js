/* eslint-disable require-jsdoc */

const Constants = require('../constants');
const {Baidu, BrowserId, OperaMini, Puffin, UCBrowserNew, UCBrowserOld, Useragent, Wap} = require('./Header/');

class Header {
  static analyseHeaders() {
    /* Analyse the main useragent header */
    let header;
    if ((header = Header.getHeader.call(this, 'User-Agent'))) {
      Header.analyseUserAgent.call(this, header);
    }

    /* Analyse secondary useragent headers */

    if ((header = Header.getHeader.call(this, 'X-Original-User-Agent'))) {
      Header.additionalUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-Device-User-Agent'))) {
      Header.additionalUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'Device-Stock-UA'))) {
      Header.additionalUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-OperaMini-Phone-UA'))) {
      Header.additionalUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-UCBrowser-Device-UA'))) {
      Header.additionalUserAgent.call(this, header);
    }

    /* Analyse browser specific headers */

    if ((header = Header.getHeader.call(this, 'X-OperaMini-Phone'))) {
      Header.analyseOperaMiniPhone.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-UCBrowser-Phone-UA'))) {
      Header.analyseOldUCUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-UCBrowser-UA'))) {
      Header.analyseNewUCUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'X-Puffin-UA'))) {
      Header.analysePuffinUserAgent.call(this, header);
    }

    if ((header = Header.getHeader.call(this, 'Baidu-FlyFlow'))) {
      Header.analyseBaiduHeader.call(this, header);
    }

    /* Analyse Android WebView browser ids */

    if ((header = Header.getHeader.call(this, 'X-Requested-With'))) {
      Header.analyseBrowserId.call(this, header);
    }

    /* Analyse WAP profile header */

    if ((header = Header.getHeader.call(this, 'X-Wap-Profile'))) {
      Header.analyseWapProfile.call(this, header);
    }

    return this;
  }

  static analyseUserAgent(header) {
    new Useragent(header, this.data, this.options);
  }

  static analyseBaiduHeader(header) {
    new Baidu(header, this.data);
  }

  static analyseOperaMiniPhone(header) {
    new OperaMini(header, this.data);
  }

  static analyseBrowserId(header) {
    new BrowserId(header, this.data);
  }

  static analysePuffinUserAgent(header) {
    new Puffin(header, this.data);
  }

  static analyseNewUCUserAgent(header) {
    new UCBrowserNew(header, this.data);
  }

  static analyseOldUCUserAgent(header) {
    new UCBrowserOld(header, this.data);
  }

  static analyseWapProfile(header) {
    new Wap(header, this.data);
  }

  static additionalUserAgent(ua) {
    const Parser = require('../Parser');
    const extra = new Parser(ua);

    if (extra.device.type !== Constants.deviceType.DESKTOP) {
      if (extra.os.name) {
        this.data.os = extra.os;
      }

      if (extra.device.identified) {
        this.data.device = extra.device;
      }
    }
  }

  static getHeader(h) {
    for (let header of Object.keys(this.headers)) {
      if (h.toLowerCase() === header.toLowerCase()) {
        return this.headers[header];
      }
    }
  }
}

module.exports = Header;
