/* eslint-disable require-jsdoc */

const Constants = require('../constants');
const DeviceModels = require('../data/DeviceModels');
const Version = require('../model/Version');
const Header = require('../Analyser/Header');

class Camouflage {
  static detectCamouflage() {
    let ua;
    if ((ua = Header.getHeader.call(this, 'User-Agent'))) {
      Camouflage.detectCamouflagedAndroidBrowser.call(this, ua);
      Camouflage.detectCamouflagedAndroidAsusBrowser.call(this, ua);
      Camouflage.detectCamouflagedAsSafari.call(this, ua);
      Camouflage.detectCamouflagedAsChrome.call(this, ua);
    }
    if (this.options.useragent) {
      Camouflage.detectCamouflagedUCBrowser.call(this, this.options.useragent);
    }
    if (this.options.engine) {
      Camouflage.detectCamouflagedBasedOnEngines.call(this);
    }
    if (this.options.features) {
      Camouflage.detectCamouflagedBasedOnFeatures.call(this);
    }
    return this;
  }

  static detectCamouflagedAndroidBrowser(ua) {
    let match;
    let device;

    if ((match = /Mac OS X 10_6_3; ([^;]+); [a-z]{2}(?:-[a-z]{2})?\)/u.exec(ua))) {
      this.data.browser.name = 'Android Browser';
      this.data.browser.version = null;
      this.data.browser.mode = 'desktop';
      this.data.os.name = 'Android';
      this.data.os.alias = null;
      this.data.os.version = null;
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
      this.data.device.type = 'mobile';
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
      this.data.features.push('foundDevice');
    }
    if ((match = /Mac OS X 10_5_7; [^/);]+\/([^/);]+)\//u.exec(ua))) {
      this.data.browser.name = 'Android Browser';
      this.data.browser.version = null;
      this.data.browser.mode = 'desktop';
      this.data.os.name = 'Android';
      this.data.os.alias = null;
      this.data.os.version = null;
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
      this.data.device.type = 'mobile';
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
      this.data.features.push('foundDevice');
    }
    return this;
  }

  static detectCamouflagedAndroidAsusBrowser(ua) {
    if (/Linux Ventana; [a-z]{2}(?:-[a-z]{2})?; (.+) Build/u.test(ua)) {
      this.data.browser.name = 'Android Browser';
      this.data.browser.version = null;
      this.data.browser.channel = null;
      this.data.browser.mode = 'desktop';
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
      this.data.features.push('foundDevice');
    }
    return this;
  }

  static detectCamouflagedAsSafari(ua) {
    if (this.data.isBrowser('Safari') && !/Darwin/u.test(ua)) {
      if (this.data.isOs('iOS') && !/^Mozilla/u.test(ua)) {
        this.data.features.push('noMozillaPrefix');
        this.data.camouflage = true;
      }
      if (!/Version\/[0-9.]+/u.test(ua)) {
        this.data.features.push('noVersion');

        this.data.camouflage = true;
      }
    }
    return this;
  }

  static detectCamouflagedAsChrome(ua) {
    if (this.data.isBrowser('Chrome')) {
      if (
        /(?:Chrome|CrMo|CriOS)\//u.test(ua) &&
        !/(?:Chrome|CrMo|CriOS)\/([0-9]{1,2}\.[0-9]\.[0-9]{3,4}\.[0-9]+)/u.test(ua)
      ) {
        this.data.features.push('wrongVersion');
        this.data.camouflage = true;
      }
    }
    return this;
  }

  static detectCamouflagedUCBrowser(ua) {
    if (ua === 'Mozilla/5.0 (X11; U; Linux i686; zh-CN; rv:1.2.3.4) Gecko/') {
      if (!this.data.isBrowser('UC Browser')) {
        this.data.browser.name = 'UC Browser';
        this.data.browser.version = null;
        this.data.browser.stock = false;
      }
      if (this.data.isOs('Windows')) {
        this.data.os.reset();
      }
      this.data.engine.reset({name: 'Gecko'});
      this.data.device.type = 'mobile';
    }
    let match;
    if (this.data.isBrowser('Chrome')) {
      if ((match = /UBrowser\/?([0-9.]*)/u.exec(ua))) {
        this.data.browser.stock = false;
        this.data.browser.name = 'UC Browser';
        this.data.browser.version = new Version({value: match[1], details: 2});
        this.data.browser.type = Constants.browserType.BROWSER;
        this.data.browser.channel = null;
      }
    }
    return this;
  }

  static detectCamouflagedBasedOnEngines() {
    if (this.data.engine.name && this.data.browser.mode !== 'proxy') {
      /* If it claims not to be Trident, but it is probably Trident running camouflage mode */
      if (this.options.engine & Constants.engineType.TRIDENT) {
        this.data.features.push('trident');
        if (this.data.engine.name && this.data.engine.name !== 'Trident') {
          this.data.camouflage =
            !this.data.browser.name ||
            (this.data.browser.name !== 'Maxthon' && this.data.browser.name !== 'Motorola WebKit');
        }
      }
      /* If it claims not to be Opera, but it is probably Opera running camouflage mode */
      if (this.options.engine & Constants.engineType.PRESTO) {
        this.data.features.push('presto');
        if (this.data.engine.name && this.data.engine.name !== 'Presto') {
          this.data.camouflage = true;
        }
        if (this.data.browser.name && this.data.browser.name === 'Internet Explorer') {
          this.data.camouflage = true;
        }
      }
      /* If it claims not to be Gecko, but it is probably Gecko running camouflage mode */
      if (this.options.engine & Constants.engineType.GECKO) {
        this.data.features.push('gecko');
        if (this.data.engine.name && this.data.engine.name !== 'Gecko') {
          this.data.camouflage = true;
        }
        if (this.data.browser.name && this.data.browser.name === 'Internet Explorer') {
          this.data.camouflage = true;
        }
      }
      /* If it claims not to be Webkit, but it is probably Webkit running camouflage mode */
      if (this.options.engine & Constants.engineType.WEBKIT) {
        this.data.features.push('webkit');
        if (this.data.engine.name && (this.data.engine.name !== 'Blink' && this.data.engine.name !== 'Webkit')) {
          this.data.camouflage = true;
        }
        if (this.data.browser.name && this.data.browser.name === 'Internet Explorer') {
          this.data.camouflage = true;
        }
        /* IE 11 on mobile now supports Webkit APIs */
        if (
          this.data.browser.name &&
          this.data.browser.name === 'Mobile Internet Explorer' &&
          this.data.browser.version &&
          this.data.browser.version.toFloat() >= 11 &&
          this.data.os.name &&
          this.data.os.name === 'Windows Phone'
        ) {
          this.data.camouflage = false;
        }
        /* IE 11 Developer Preview now supports  Webkit APIs */
        if (
          this.data.browser.name &&
          this.data.browser.name === 'Internet Explorer' &&
          this.data.browser.version &&
          this.data.browser.version.toFloat() >= 11 &&
          this.data.os.name &&
          this.data.os.name === 'Windows'
        ) {
          this.data.camouflage = false;
        }
        /* EdgeHTML rendering engine also appears to be WebKit */
        if (this.data.engine.name && this.data.engine.name === 'EdgeHTML') {
          this.data.camouflage = false;
        }
        /* Firefox 48+ support certain Webkit features */
        if (this.options.engine & Constants.engineType.GECKO) {
          this.data.camouflage = false;
        }
      }
      if (this.options.engine & Constants.engineType.CHROMIUM) {
        this.data.features.push('chrome');
        if (
          this.data.engine.name &&
          (this.data.engine.name !== 'EdgeHTML' &&
            this.data.engine.name !== 'Blink' &&
            this.data.engine.name !== 'Webkit')
        ) {
          this.data.camouflage = true;
        }
      }
      /* If it claims to be Safari and uses V8, it is probably an Android device running camouflage mode */
      if (this.data.engine.name === 'Webkit' && this.options.engine & Constants.engineType.V8) {
        this.data.features.push('v8');
        if (this.data.browser.name && this.data.browser.name === 'Safari') {
          this.data.camouflage = true;
        }
      }
    }
    return this;
  }

  static detectCamouflagedBasedOnFeatures() {
    if (this.data.browser.name && this.data.os.name) {
      if (
        this.data.os.name === 'iOS' &&
        this.data.browser.name !== 'Opera Mini' &&
        this.data.browser.name !== 'UC Browser' &&
        this.data.os.version
      ) {
        if (this.data.os.version.toFloat() < 4.0 && this.options.features & Constants.feature.SANDBOX) {
          this.data.features.push('foundSandbox');
          this.data.camouflage = true;
        }
        if (this.data.os.version.toFloat() < 4.2 && this.options.features & Constants.feature.WEBSOCKET) {
          this.data.features.push('foundSockets');
          this.data.camouflage = true;
        }
        if (this.data.os.version.toFloat() < 5.0 && this.options.features & Constants.feature.WORKER) {
          this.data.features.push('foundWorker');
          this.data.camouflage = true;
        }
      }
      if (this.data.os.name !== 'iOS' && this.data.browser.name === 'Safari' && this.data.browser.version) {
        if (this.data.browser.version.toFloat() < 4.0 && this.options.features & Constants.feature.APPCACHE) {
          this.data.features.push('foundAppCache');
          this.data.camouflage = true;
        }
        if (this.data.browser.version.toFloat() < 4.1 && this.options.features & Constants.feature.HISTORY) {
          this.data.features.push('foundHistory');
          this.data.camouflage = true;
        }
        if (this.data.browser.version.toFloat() < 5.1 && this.options.features & Constants.feature.FULLSCREEN) {
          this.data.features.push('foundFullscreen');
          this.data.camouflage = true;
        }
        if (this.data.browser.version.toFloat() < 5.2 && this.options.features & Constants.feature.FILEREADER) {
          this.data.features.push('foundFileReader');
          this.data.camouflage = true;
        }
      }
    }
    return this;
  }
}

module.exports = Camouflage;
