/* eslint-disable require-jsdoc */

const Constants = require('../constants');
const Using = require('../model/Using');
const Version = require('../model/Version');
const Family = require('../model/Family');

class Derive {
  static deriveInformation() {
    if (this.data.device.flag) {
      Derive.deriveBasedOnDeviceFlag.call(this);
    }
    if (this.data.os.name) {
      Derive.deriveBasedOnOperatingSystem.call(this);
    }
    if (this.data.browser.name) {
      Derive.deriveOperaDevices.call(this);
    }
    if (this.data.browser.name) {
      Derive.deriveFirefoxOS.call(this);
    }
    if (this.data.browser.name) {
      Derive.deriveTrident.call(this);
      Derive.deriveOperaRenderingEngine.call(this);
      Derive.deriveOmniWebRenderingEngine.call(this);
      Derive.deriveNetFrontRenderingEngine.call(this);
    }
    return this;
  }

  static deriveDeviceSubType() {
    if (this.data.device.type === 'mobile' && !this.data.device.subtype) {
      this.data.device.subtype = 'feature';
      if (
        [
          'Android',
          'Bada',
          'BlackBerry',
          'BlackBerry OS',
          'Firefox OS',
          'iOS',
          'iPhone OS',
          'Kin OS',
          'Maemo',
          'MeeGo',
          'Palm OS',
          'Sailfish',
          'Series60',
          'Series80',
          'Tizen',
          'Ubuntu Touch',
          'Windows Mobile',
          'Windows Phone',
          'webOS',
        ].includes(this.data.os.getName())
      ) {
        this.data.device.subtype = 'smart';
      }
      if (this.data.os.name && ['Windows Phone'].includes(this.data.os.name)) {
        this.data.device.subtype = 'smart';
      }
      if (this.data.os.family && ['Android'].includes(this.data.os.family.getName())) {
        this.data.device.subtype = 'smart';
      }
    }
    return this;
  }

  static deriveOmniWebRenderingEngine() {
    if (this.data.isBrowser('OmniWeb')) {
      const version = parseFloat(this.data.browser.getVersion() || 0);
      if (version < 5) {
        this.data.engine.reset();
      }
      if (version >= 5 && version < 5.5 && !this.data.isEngine('WebCore')) {
        this.data.engine.reset({name: 'WebCore'});
      }
      if (version >= 5.5 && !this.data.isEngine('WebKit')) {
        this.data.engine.reset({name: 'WebKit'});
      }
    }
  }

  static deriveOperaRenderingEngine() {
    if (this.data.isBrowser('Opera') || this.data.isBrowser('Opera Mobile')) {
      const version = this.data.browser.getVersion();
      if (version >= 3.5 && version < 7 && !this.data.isEngine('Electra')) {
        this.data.engine.reset({name: 'Electra'});
      }
      if (version >= 7 && version < 13 && !this.data.isEngine('Presto')) {
        this.data.engine.reset({name: 'Presto'});
      }
    }
    if (this.data.isBrowser('Opera Mini') && !this.data.isOs('iOS') && !this.data.isEngine('Presto')) {
      this.data.engine.reset({name: 'Presto'});
    }
  }

  static deriveNetFrontRenderingEngine() {
    if (this.data.isBrowser('NetFront') && !this.data.isEngine('NetFront')) {
      this.data.engine.reset({name: 'NetFront'});
    }
  }

  static deriveTrident() {
    if (this.data.isType('desktop') && this.data.isBrowser('Internet Explorer') && !this.data.engine.getName()) {
      if (this.data.isBrowser('Internet Explorer', '>=', 4)) {
        this.data.engine.set({name: 'Trident'});
      }
    }
    if (this.data.isMobile() && this.data.isBrowser('Mobile Internet Explorer') && !this.data.engine.getName()) {
      if (this.data.isBrowser('Mobile Internet Explorer', '=', 6)) {
        this.data.engine.set({name: 'Trident'});
      }
      if (this.data.isBrowser('Mobile Internet Explorer', '=', 7)) {
        this.data.engine.set({name: 'Trident', version: new Version({value: '3.1'})});
      }
    }
  }

  static deriveFirefoxOS() {
    if (['Firefox Mobile', 'Servo Nightly Build'].includes(this.data.browser.name) && !this.data.os.name) {
      this.data.os.name = 'Firefox OS';
    }
    if (this.data.os.name && this.data.os.name === 'Firefox OS' && this.data.engine.name === 'Gecko') {
      switch (this.data.engine.getVersion()) {
        case '18.0':
          this.data.os.version = new Version({value: '1.0.1'});
          break;
        case '18.1':
          this.data.os.version = new Version({value: '1.1'});
          break;
        case '26.0':
          this.data.os.version = new Version({value: '1.2'});
          break;
        case '28.0':
          this.data.os.version = new Version({value: '1.3'});
          break;
        case '30.0':
          this.data.os.version = new Version({value: '1.4'});
          break;
        case '32.0':
          this.data.os.version = new Version({value: '2.0'});
          break;
        case '34.0':
          this.data.os.version = new Version({value: '2.1'});
          break;
        case '37.0':
          this.data.os.version = new Version({value: '2.2'});
          break;
        case '44.0':
          this.data.os.version = new Version({value: '2.5'});
          break;
      }
    }
  }

  static deriveOperaDevices() {
    if (this.data.browser.name === 'Opera' && this.data.device.type === Constants.deviceType.TELEVISION) {
      this.data.browser.name = 'Opera Devices';
      this.data.browser.version = null;
      if (this.data.engine.getName() === 'Presto') {
        const data = {
          '2.12': '3.4',
          '2.11': '3.3',
          '2.10': '3.2',
          '2.9': '3.1',
          '2.8': '3.0',
          '2.7': '2.9',
          '2.6': '2.8',
          '2.4': '10.3',
          '2.3': '10',
          '2.2': '9.7',
          '2.1': '9.6',
        };
        const key = this.data.engine
          .getVersion()
          .split('.')
          .slice(0, 2)
          .join('.');
        if (data[key]) {
          this.data.browser.version = new Version({value: data[key]});
        } else {
          this.data.browser.version = null;
        }
      }
      this.data.os.reset();
    }
  }

  static deriveBasedOnDeviceFlag() {
    const flag = this.data.device.flag;
    if (flag === Constants.flag.NOKIAX) {
      this.data.os.name = 'Nokia X Platform';
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.version = null;
      this.data.device.flag = null;
    }
    if (flag === Constants.flag.FIREOS) {
      this.data.os.name = 'FireOS';
      this.data.os.family = new Family({name: 'Android'});
      if (this.data.os.version && this.data.os.version.value) {
        switch (this.data.os.version.value) {
          case '2.3.3':
          case '2.3.4':
            this.data.os.version = new Version({value: '1'});
            break;
          case '4.0.3':
            this.data.os.version = new Version({value: '2'});
            break;
          case '4.2.2':
            this.data.os.version = new Version({value: '3'});
            break;
          case '4.4.2':
            this.data.os.version = new Version({value: '4'});
            break;
          case '4.4.3':
            this.data.os.version = new Version({value: '4.5'});
            break;
          case '5.1.1':
            this.data.os.version = new Version({value: '5'});
            break;
          default:
            this.data.os.version = null;
            break;
        }
      }
      if (this.data.isBrowser('Chrome')) {
        this.data.browser.reset();
        this.data.browser.using = new Using({name: 'Amazon WebView'});
      }
      if (this.data.browser.isUsing('Chromium WebView')) {
        this.data.browser.using = new Using({name: 'Amazon WebView'});
      }
      this.data.device.flag = null;
    }
    if (flag === Constants.flag.GOOGLETV) {
      this.data.os.name = 'Google TV';
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.version = null;
      this.data.device.flag = null;
    }
    if (flag === Constants.flag.ANDROIDTV) {
      this.data.os.name = 'Android TV';
      this.data.os.family = new Family({name: 'Android'});
      this.data.device.flag = null;
      this.data.device.series = null;
    }
    if (flag === Constants.flag.ANDROIDWEAR) {
      this.data.os.name = 'Android Wear';
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.version = null;
      this.data.device.flag = null;
      if (this.data.browser.isUsing('Chrome Content Shell')) {
        this.data.browser.name = 'Wear Internet Browser';
        this.data.browser.using = null;
      }
    }
    if (flag === Constants.flag.GOOGLEGLASS) {
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.name = null;
      this.data.os.version = null;
      this.data.device.flag = null;
    }
    if (flag === Constants.flag.UIQ) {
      this.data.device.flag = null;
      if (!this.data.isOs('UIQ')) {
        this.data.os.name = 'UIQ';
        this.data.os.version = null;
      }
    }
    if (flag === Constants.flag.S60) {
      this.data.device.flag = null;
      if (!this.data.isOs('Series60')) {
        this.data.os.name = 'Series60';
        this.data.os.version = null;
      }
    }
    if (flag === Constants.flag.MOAPS) {
      this.data.device.flag = null;
      this.data.os.name = 'MOAP(S)';
      this.data.os.version = null;
    }
  }

  static deriveBasedOnOperatingSystem() {
    /* Derive the default browser on Windows Mobile */
    if (this.data.os.name === 'Windows Mobile' && this.data.isBrowser('Internet Explorer')) {
      this.data.browser.name = 'Mobile Internet Explorer';
    }
    /* Derive the default browser on Android */
    if (
      this.data.os.name === 'Android' &&
      !this.data.browser.using &&
      !this.data.browser.name &&
      this.data.browser.stock
    ) {
      this.data.browser.name = 'Android Browser';
    }
    /* Derive the default browser on Google TV */
    if (this.data.os.name === 'Google TV' && !this.data.browser.name && this.data.browser.stock) {
      this.data.browser.name = 'Chrome';
    }
    /* Derive the default browser on BlackBerry */
    if (this.data.os.name === 'BlackBerry' && !this.data.browser.name && this.data.browser.stock) {
      this.data.browser.name = 'BlackBerry Browser';
      this.data.browser.hidden = true;
    }
    if (this.data.os.name === 'BlackBerry OS' && !this.data.browser.name && this.data.browser.stock) {
      this.data.browser.name = 'BlackBerry Browser';
      this.data.browser.hidden = true;
    }
    if (this.data.os.name === 'BlackBerry Tablet OS' && !this.data.browser.name && this.data.browser.stock) {
      this.data.browser.name = 'BlackBerry Browser';
      this.data.browser.hidden = true;
    }
    /* Derive the default browser on Tizen */
    if (
      this.data.os.name === 'Tizen' &&
      !this.data.browser.name &&
      this.data.browser.stock &&
      [Constants.deviceType.MOBILE, Constants.deviceType.APPLIANCE].includes(this.data.device.type)
    ) {
      this.data.browser.name = 'Samsung Browser';
    }
    /* Derive the default browser on Aliyun OS */
    if (
      this.data.os.name === 'Aliyun OS' &&
      !this.data.browser.using &&
      !this.data.browser.name &&
      this.data.browser.stock
    ) {
      this.data.browser.name = 'Aliyun Browser';
    }
    if (this.data.os.name === 'Aliyun OS' && this.data.browser.isUsing('Chrome Content Shell')) {
      this.data.browser.name = 'Aliyun Browser';
      this.data.browser.using = null;
      this.data.browser.stock = true;
    }
    if (this.data.os.name === 'Aliyun OS' && this.data.browser.stock) {
      this.data.browser.hidden = true;
    }
    /* Derive OS/2 nickname */
    if (this.data.os.name === 'OS/2') {
      if (this.data.os.version) {
        if (this.data.os.version.is('>', '2')) {
          this.data.os.version.nickname = 'Warp';
        }
      }
    }
    /* Derive HP TouchPad based on webOS and tablet */
    if (this.data.os.name === 'webOS' && this.data.device.type === Constants.deviceType.TABLET) {
      this.data.device.manufacturer = 'HP';
      this.data.device.model = 'TouchPad';
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
    /* Derive Windows 10 Mobile edition */
    if (this.data.os.name === 'Windows Phone') {
      if (this.data.os.version) {
        if (this.data.os.version.is('=', '10')) {
          this.data.os.alias = 'Windows';
          this.data.os.edition = 'Mobile';
          this.data.os.version.alias = '10';
        }
      }
    }
    /* Derive manufacturer and model based on MacOS or OS X */
    if (this.data.os.name === 'OS X' || this.data.os.name === 'Mac OS') {
      if (!this.data.device.model) {
        this.data.device.manufacturer = 'Apple';
        this.data.device.model = 'Macintosh';
        this.data.device.identified |= Constants.id.INFER;
        this.data.device.hidden = true;
      }
    }
    /* Derive manufacturer and model based on MacOS or OS X */
    if (this.data.os.name === 'iOS') {
      if (!this.data.device.model) {
        this.data.device.manufacturer = 'Apple';
        this.data.device.identified |= Constants.id.INFER;
        this.data.device.hidden = true;
      }
    }
    /* Derive iOS and OS X aliases */
    if (this.data.os.name === 'iOS') {
      if (this.data.os.version) {
        if (this.data.os.version.is('<', '4')) {
          this.data.os.alias = 'iPhone OS';
        }
      }
    }
    if (this.data.os.name === 'OS X') {
      if (this.data.os.version) {
        if (this.data.os.version.is('<', '10.7')) {
          this.data.os.alias = 'Mac OS X';
        }
        if (this.data.os.version.is('>=', '10.12')) {
          this.data.os.alias = 'macOS';
        }
        if (this.data.os.version.is('10.7')) {
          this.data.os.version.nickname = 'Lion';
        }
        if (this.data.os.version.is('10.8')) {
          this.data.os.version.nickname = 'Mountain Lion';
        }
        if (this.data.os.version.is('10.9')) {
          this.data.os.version.nickname = 'Mavericks';
        }
        if (this.data.os.version.is('10.10')) {
          this.data.os.version.nickname = 'Yosemite';
        }
        if (this.data.os.version.is('10.11')) {
          this.data.os.version.nickname = 'El Capitan';
        }
        if (this.data.os.version.is('10.12')) {
          this.data.os.version.nickname = 'Sierra';
        }
        if (this.data.os.version.is('10.13')) {
          this.data.os.version.nickname = 'High Sierra';
        }
        if (this.data.os.version.is('10.14')) {
          this.data.os.version.nickname = 'Mojave';
        }
        if (this.data.os.version.is('10.15')) {
          this.data.os.version.nickname = 'Catalina';
        }
      }
    }
  }
}

module.exports = Derive;
