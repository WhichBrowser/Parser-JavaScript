/* eslint-disable require-jsdoc */

const Using = require('../../../model/Using');
const Version = require('../../../model/Version');
const Family = require('../../../model/Family');
const Constants = require('../../../constants');
const DeviceModels = require('../../../data/DeviceModels');
const BuildIds = require('../../../data/BuildIds');
const Applications = require('../../../data/Applications');

class Application {
  static detectApplication(ua) {
    /* Detect applications */
    Application.detectSpecificApplications.call(this, ua);
    Application.detectRemainingApplications.call(this, ua);
    return this;
  }

  static detectSpecificApplications(ua) {
    /* Sony Updatecenter */
    let match;
    let device;
    if ((match = /^(.*) Build\/.* (?:com.sonyericsson.updatecenter|UpdateCenter)\/[A-Z0-9.]+$/iu.exec(ua))) {
      this.data.browser.name = 'Sony Update Center';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.APP;
      this.data.os.reset({
        name: 'Android',
      });
      this.data.device.model = match[1];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Sony Select SDK */
    if ((match = /Android [0-9.]+; (.*) Sony\/.*SonySelectSDK\/([0-9.]+)/iu.exec(ua))) {
      this.data.browser.reset();
      this.data.browser.type = Constants.browserType.APP;
      this.data.browser.using = new Using({
        name: 'Sony Select SDK',
        version: new Version({
          value: match[2],
          details: 2,
        }),
      });
      this.data.device.model = match[1];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Samsung Mediahub */
    if ((match = /^Stamhub [^/]+\/([^;]+);.*:([0-9.]+)\/[^/]+\/[^:]+:user\/release-keys$/iu.exec(ua))) {
      this.data.browser.name = 'Mediahub';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.APP_MEDIAPLAYER;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[2]}),
      });
      this.data.device.model = match[1];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* "Android Application" */
    if (/Android Application/iu.test(ua)) {
      if (
        (match = /^(.+) Android Application \([0-9]+, .+ v[0-9.]+\) - [a-z-]+ (.*) [a-z_-]+ - [0-9A-F]{8,8}-[0-9A-F]{4,4}-[0-9A-F]{4,4}-[0-9A-F]{4,4}-[0-9A-F]{12,12}$/iu.exec(
          ua
        ))
      ) {
        this.data.browser.name = match[1];
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.APP;
        this.data.os.reset({
          name: 'Android',
        });
        this.data.device.model = match[2];
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.type = Constants.deviceType.MOBILE;
        device = DeviceModels.identify('android', match[2]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (
        (match = /^(.+) Android Application - (.*) Build\/(.+) {2}- [0-9A-F]{8,8}-[0-9A-F]{4,4}-[0-9A-F]{4,4}-[0-9A-F]{4,4}-[0-9A-F]{12,12}$/iu.exec(
          ua
        ))
      ) {
        this.data.browser.name = match[1];
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.APP;
        this.data.os.reset({
          name: 'Android',
        });
        const version = BuildIds.identify(match[3]);
        if (version) {
          this.data.os.version = version;
        }
        this.data.device.model = match[2];
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.type = Constants.deviceType.MOBILE;
        device = DeviceModels.identify('android', match[2]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if ((match = /^(.+) Android Application - [a-z-]+ (.*) [a-z_-]+$/iu.exec(ua))) {
        this.data.browser.name = match[1];
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.APP;
        this.data.os.reset({
          name: 'Android',
        });
        this.data.device.model = match[2];
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.type = Constants.deviceType.MOBILE;
        device = DeviceModels.identify('android', match[2]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
    /* AiMeiTuan */
    if ((match = /^AiMeiTuan \/[^-]+-([0-9.]+)-(.*)-[0-9]+x[0-9]+-/iu.exec(ua))) {
      this.data.browser.name = 'AiMeiTuan';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.APP;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[1]}),
      });
      this.data.device.model = match[2];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[2]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Instagram */
    if (
      (match = /^Instagram ([0-9.]+) Android (?:IC )?\([0-9]+\/([0-9.]+); [0-9]+dpi; [0-9]+x[0-9]+; [^;]+; ([^;]*);/iu.exec(
        ua
      ))
    ) {
      this.data.browser.name = 'Instagram';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.APP_SOCIAL;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[2]}),
      });
      this.data.device.model = match[3];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Pinterest */
    if ((match = /^Pinterest for Android( Tablet)?\/([0-9.]+) \(([^;]+); ([0-9.]+)\)/iu.exec(ua))) {
      this.data.browser.name = 'Pinterest';
      this.data.browser.version = new Version({value: match[2]});
      this.data.browser.type = Constants.browserType.APP_SOCIAL;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[4]}),
      });
      this.data.device.model = match[3];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = match[1] === ' Tablet' ? Constants.deviceType.TABLET : Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Dr. Web Anti-Virus */
    if (
      (match = /Dr\.Web anti-virus Light Version: ([0-9.]+) Device model: (.*) Firmware version: ([0-9.]+)/u.exec(
        ua
      ))
    ) {
      this.data.browser.name = 'Dr. Web Light';
      this.data.browser.version = new Version({
        value: match[1],
        details: 2,
      });
      this.data.browser.type = Constants.browserType.APP_ANTIVIRUS;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[3]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[2]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Google Earth */
    if ((match = /GoogleEarth\/([0-9.]+)\(Android;Android \((.+)-[^-]+-user-([0-9.]+)\);/u.exec(ua))) {
      this.data.browser.name = 'Google Earth';
      this.data.browser.version = new Version({
        value: match[1],
        details: 2,
      });
      this.data.browser.type = Constants.browserType.APP;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[3]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[2]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Groupon */
    if ((match = /Groupon\/([0-9.]+) \(Android ([0-9.]+); [^/]+ \/ [A-Z][a-z]+ ([^;]*);/u.exec(ua))) {
      this.data.browser.name = 'Groupon';
      this.data.browser.version = new Version({
        value: match[1],
        details: 2,
      });
      this.data.browser.type = Constants.browserType.APP_SHOPPING;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[2]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.model = match[3];
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Whatsapp */
    if (
      (match = /WhatsApp\+?\/([0-9.]+?) (Android|S60Version|WP7)\/([0-9._]+?) Device\/([^-]+?)-(.*?)(?:-\([0-9]+?\.[0-9]+?\))?(?:-H[0-9]+?\.[0-9]+?\.[0-9]+?\.[0-9]+?)?$/u.exec(
        ua
      ))
    ) {
      this.data.browser.name = 'WhatsApp';
      this.data.browser.version = new Version({
        value: match[1],
        details: 2,
      });
      this.data.browser.type = Constants.browserType.APP_CHAT;
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.manufacturer = match[4];
      this.data.device.model = match[5];
      this.data.device.identified |= Constants.id.PATTERN;
      if (match[2] === 'Android') {
        this.data.os.reset({
          name: 'Android',
          version: new Version({
            value: match[3].replace(/_/g, '.'),
          }),
        });
        device = DeviceModels.identify('android', match[5]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (match[2] === 'WP7') {
        this.data.os.reset({
          name: 'Windows Phone',
          version: new Version({
            value: match[3],
            details: 2,
          }),
        });
        device = DeviceModels.identify('wp', match[5]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (match[2] === 'S60Version') {
        this.data.os.reset({
          name: 'Series60',
          version: new Version({value: match[3]}),
          family: new Family({
            name: 'Symbian',
          }),
        });
        device = DeviceModels.identify('symbian', match[5]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (match[2] == 'WP7') {
        this.data.os.reset({
          name: 'Windows Phone',
          version: new Version({
            value: match[3],
            details: 2,
          }),
        });
        device = DeviceModels.identify('wp', match[5]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
    /* Yahoo */
    if (
      (match = /YahooMobile(?:Messenger|Mail|Weather)\/1.0 \(Android (Messenger|Mail|Weather); ([0-9.]+)\) \([^;]+; ?[^;]+; ?([^;]+); ?([0-9.]+)\/[^;)/]+\)/u.exec(
        ua
      ))
    ) {
      this.data.browser.name = `Yahoo ${match[1]}`;
      this.data.browser.version = new Version({
        value: match[2],
        details: 3,
      });
      switch (match[1]) {
        case 'Messenger':
          this.data.browser.type = Constants.browserType.APP_CHAT;
          break;
        case 'Mail':
          this.data.browser.type = Constants.browserType.APP_EMAIL;
          break;
        case 'Weather':
          this.data.browser.type = Constants.browserType.APP_NEWS;
          break;
      }
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[4]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Yahoo Mobile App */
    if (
      (match = /YahooJMobileApp\/[0-9.]+ \(Android [a-z]+; ([0-9.]+)\) \([^;]+; ?[^;]+; ?[^;]+; ?([^;]+); ?([0-9.]+)\/[^;)/]+\)/u.exec(
        ua
      ))
    ) {
      this.data.browser.name = 'Yahoo Mobile';
      this.data.browser.version = new Version({
        value: match[1],
        details: 3,
      });
      this.data.browser.type = Constants.browserType.APP_SEARCH;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[3]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[2]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* ICQ */
    if ((match = /ICQ_Android\/([0-9.]+) \(Android; [0-9]+; ([0-9.]+); [^;]+; ([^;]+);/u.exec(ua))) {
      this.data.browser.name = 'ICQ';
      this.data.browser.version = new Version({
        value: match[1],
        details: 3,
      });
      this.data.browser.type = Constants.browserType.APP_CHAT;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[2]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* Facebook for Android */
    if ((match = /^\[FBAN\/(FB4A|PAAA);.*FBDV\/([^;]+);.*FBSV\/([0-9.]+);/u.exec(ua))) {
      if (match[1] == 'FB4A') {
        this.data.browser.name = 'Facebook';
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.APP_SOCIAL;
      }
      if (match[1] == 'PAAA') {
        this.data.browser.name = 'Facebook Pages';
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.APP_SOCIAL;
      }
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[3]}),
      });
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[2]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
    /* VK */
    if (
      (match = /^VKAndroidApp\/([0-9.]+)-[0-9]+ \(Android ([^;]+); SDK [^;]+; [^;]+; [a-z]+ ([^;]+);/iu.exec(ua))
    ) {
      this.data.browser.name = 'VK';
      this.data.browser.version = new Version({
        value: match[1],
        details: 2,
      });
      this.data.browser.type = Constants.browserType.APP_SOCIAL;
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: match[2]}),
      });
      this.data.device.model = match[3];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.type = Constants.deviceType.MOBILE;
      device = DeviceModels.identify('android', match[3]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
  }

  static detectRemainingApplications(ua) {
    const data = Applications.identifyOther(ua);
    if (data) {
      this.data.browser.set(data['browser']);
      if (data['device']) {
        this.data.device.set(data['device']);
      }
    }
  }
}

module.exports = Application;
