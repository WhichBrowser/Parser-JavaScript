/* eslint-disable require-jsdoc */

const DeviceModels = require('../../data/DeviceModels');
const Family = require('../../model/Family');
const Version = require('../../model/Version');

class UCBrowserNew {
  constructor(header, data) {
    this.data = data;
    let match;
    let device;
    if (/pr\(UCBrowser/u.test(header)) {
      if (!this.data.isBrowser('UC Browser')) {
        this.data.browser.name = 'UC Browser';
        this.data.browser.stock = false;
        this.data.browser.version = null;
        if ((match = /pr\(UCBrowser(?:\/([0-9.]+))/u.exec(header))) {
          this.data.browser.version = new Version({value: match[1], details: 2});
        }
      }
    }

    /* Find os */
    if (/pf\(Java\)/u.test(header)) {
      if ((match = /dv\(([^)]*)\)/u.exec(header))) {
        if (this.identifyBasedOnModel(match[1])) {
          return;
        }
      }
    }

    if (/pf\(Linux\)/u.test(header) && (match = /ov\((?:Android )?([0-9.]+)/u.exec(header))) {
      this.data.os.name = 'Android';
      this.data.os.version = new Version({
        value: match[1],
      });
    }

    if (/pf\(Symbian\)/u.test(header) && (match = /ov\(S60V([0-9])/u.exec(header))) {
      if (!this.data.isOs('Series60')) {
        this.data.os.name = 'Series60';
        this.data.os.version = new Version({
          value: match[1],
        });
      }
    }
    if (/pf\(Windows\)/u.test(header) && (match = /ov\(wds ([0-9]+\.[0-9])/u.exec(header))) {
      if (!this.data.isOs('Windows Phone')) {
        this.data.os.name = 'Windows Phone';

        switch (match[1]) {
          case '7.1':
            this.data.os.version = new Version({
              value: '7.5',
            });
            break;
          case '8.0':
            this.data.os.version = new Version({
              value: '8.0',
            });
            break;
          case '8.1':
            this.data.os.version = new Version({
              value: '8.1',
            });
            break;
          case '10.0':
            this.data.os.version = new Version({
              value: '10.0',
            });
            break;
        }
      }
    }
    if (/pf\((?:42|44)\)/u.test(header) && (match = /ov\((?:iPh OS )?(?:iOS )?([0-9_]+)/u.exec(header))) {
      if (!this.data.isOs('iOS')) {
        this.data.os.name = 'iOS';
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
        });
      }
    }

    /* Find engine */

    if ((match = /re\(AppleWebKit\/([0-9.]+)/u.exec(header))) {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = new Version({
        value: match[1],
      });
    }

    /* Find device */
    if (this.data.isOs('Android')) {
      if ((match = /dv\((.*?)\)/u.exec(header))) {
        match[1] = match[1].replace(/\s+Build/u, '');
        device = DeviceModels.identify('android', match[1]);

        if (device) {
          this.data.device = device;
        }
      }
    }

    if (this.data.isOs('Series60')) {
      if ((match = /dv\((?:Nokia)?([^)]*)\)/iu.exec(header))) {
        device = DeviceModels.identify('symbian', match[1]);

        if (device) {
          this.data.device = device;
        }
      }
    }

    if (this.data.isOs('Windows Phone')) {
      if ((match = /dv\(([^)]*)\)/u.exec(header))) {
        device = DeviceModels.identify('wp', match[1].substr(match[1].indexOf(' ')).substr(1));

        if (device) {
          this.data.device = device;
        }
      }
    }

    if (this.data.isOs('iOS')) {
      if ((match = /dv\(([^)]*)\)/u.exec(header))) {
        device = DeviceModels.identify('ios', match[1]);

        if (device) {
          this.data.device = device;
        }
      }
    }
  }

  identifyBasedOnModel(model) {
    model = model.replace(/^Nokia/iu, '');

    let device = DeviceModels.identify('symbian', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;

      if (!this.data.os.name || this.data.os.name !== 'Series60') {
        this.data.os.name = 'Series60';
        this.data.os.version = null;
        this.data.os.family = new Family({
          name: 'Symbian',
        });
      }

      return true;
    }

    device = DeviceModels.identify('s40', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;

      if (!this.data.os.name || this.data.os.name !== 'Series40') {
        this.data.os.name = 'Series40';
        this.data.os.version = null;
      }

      return true;
    }

    device = DeviceModels.identify('bada', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;

      if (!this.data.os.name || this.data.os.name !== 'Bada') {
        this.data.os.name = 'Bada';
        this.data.os.version = null;
      }

      return true;
    }

    device = DeviceModels.identify('touchwiz', model);
    if (device.identified) {
      device.identified |= this.data.device.identified;
      this.data.device = device;

      if (!this.data.os.name || this.data.os.name !== 'Touchwiz') {
        this.data.os.name = 'Touchwiz';
        this.data.os.version = null;
      }

      return true;
    }
  }
}

module.exports = UCBrowserNew;
