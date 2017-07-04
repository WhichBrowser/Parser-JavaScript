/* eslint-disable require-jsdoc */

const Version = require('../../../model/Version');

class Engine {
  static detectEngine(ua) {
    Engine.detectWebkit.call(this, ua);
    Engine.detectKHTML.call(this, ua);
    Engine.detectGecko.call(this, ua);
    Engine.detectServo.call(this, ua);
    Engine.detectGoanna.call(this, ua);
    Engine.detectPresto.call(this, ua);
    Engine.detectTrident.call(this, ua);
    Engine.detectEdgeHTMLUseragent.call(this, ua);
    return this;
  }

  /* WebKit */
  static detectWebkit(ua) {
    let match;
    if ((match = /WebKit\/([0-9.]*)/iu.exec(ua))) {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = new Version({value: match[1]});
      if ((match = /(?:Chrome|Chromium)\/([0-9]*)/u.exec(ua))) {
        if (parseInt(match[1], 10) >= 27) {
          this.data.engine.reset({name: 'Blink'});
        }
      }
    }
    if ((match = /Browser\/AppleWebKit\/?([0-9.]*)/iu.exec(ua))) {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = new Version({value: match[1]});
    }
    if ((match = /AppleWebkit\(like Gecko\)/iu.exec(ua))) {
      this.data.engine.name = 'Webkit';
    }
  }

  /* KHTML */
  static detectKHTML(ua) {
    let match;
    if ((match = /KHTML\/([0-9.]*)/u.exec(ua))) {
      this.data.engine.name = 'KHTML';
      this.data.engine.version = new Version({value: match[1]});
    }
  }

  /* Gecko */
  static detectGecko(ua) {
    let match;
    if (/Gecko/u.test(ua) && !/like Gecko/iu.test(ua)) {
      this.data.engine.name = 'Gecko';
      if ((match = /; rv:([^);]+)[);]/u.exec(ua))) {
        this.data.engine.version = new Version({value: match[1], details: 3});
      }
    }
  }

  /* Servo */
  static detectServo(ua) {
    let match;
    if ((match = /Servo\/([0-9.]*)/u.exec(ua))) {
      this.data.engine.name = 'Servo';
      this.data.engine.version = new Version({value: match[1]});
    }
  }

  /* Goanna */
  static detectGoanna(ua) {
    let match;
    if (/Goanna/u.test(ua)) {
      this.data.engine.name = 'Goanna';
      if ((match = /Goanna\/([0-9]\.[0-9.]+)/u.exec(ua))) {
        this.data.engine.version = new Version({value: match[1]});
      }
      if (/Goanna\/20[0-9]{6,6}/u.test(ua) && (match = /; rv:([^);]+)[);]/u.exec(ua))) {
        this.data.engine.version = new Version({value: match[1]});
      }
    }
  }

  /* Presto */
  static detectPresto(ua) {
    let match;
    if ((match = /Presto\/([0-9.]*)/u.exec(ua))) {
      this.data.engine.name = 'Presto';
      this.data.engine.version = new Version({value: match[1]});
    }
  }

  /* Trident */
  static detectTrident(ua) {
    let match;
    if ((match = /Trident\/([0-9.]*)/u.exec(ua))) {
      this.data.engine.name = 'Trident';
      this.data.engine.version = new Version({value: match[1]});
      if (this.data.browser.version && this.data.browser.name && this.data.browser.name === 'Internet Explorer') {
        if (parseInt(this.data.engine.version, 10) >= 7 && parseFloat(this.data.browser.version) < 11) {
          this.data.browser.version = new Version({value: '11.0'});
          this.data.browser.mode = 'compat';
        }
        if (parseInt(this.data.engine.version, 10) === 6 && parseFloat(this.data.browser.version) < 10) {
          this.data.browser.version = new Version({value: '10.0'});
          this.data.browser.mode = 'compat';
        }
        if (parseInt(this.data.engine.version, 10) === 5 && parseFloat(this.data.browser.version) < 9) {
          this.data.browser.version = new Version({value: '9.0'});
          this.data.browser.mode = 'compat';
        }
        if (parseInt(this.data.engine.version, 10) === 4 && parseFloat(this.data.browser.version) < 8) {
          this.data.browser.version = new Version({value: '8.0'});
          this.data.browser.mode = 'compat';
        }
      }
      if (
        this.data.os.version &&
        this.data.os.name &&
        this.data.os.name === 'Windows Phone' &&
        this.data.browser.name &&
        this.data.browser.name === 'Mobile Internet Explorer'
      ) {
        if (parseInt(this.data.engine.version, 10) === 7 && parseFloat(this.data.os.version) < 8.1) {
          this.data.os.version = new Version({value: '8.1', details: 2});
        }
        if (parseInt(this.data.engine.version, 10) === 5 && parseFloat(this.data.os.version) < 7.5) {
          this.data.os.version = new Version({value: '7.5', details: 2});
        }
      }
    }
  }

  /* EdgeHTML */
  static detectEdgeHTMLUseragent(ua) {
    let match;
    if ((match = /Edge\/([0-9.]*)/u.exec(ua))) {
      this.data.engine.name = 'EdgeHTML';
      this.data.engine.version = new Version({value: match[1], hidden: true});
    }
  }
}

module.exports = Engine;
