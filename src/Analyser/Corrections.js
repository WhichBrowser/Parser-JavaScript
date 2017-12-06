/* eslint-disable require-jsdoc */

const Constants = require('../constants');

class Corrections {
  static applyCorrections() {
    if (this.data.browser.name && this.data.browser.using) {
      Corrections.hideBrowserBasedOnUsing.call(this);
    }
    if (this.data.browser.name && this.data.os.name) {
      Corrections.hideBrowserBasedOnOperatingSystem.call(this);
    }
    if (this.data.browser.name && this.data.device.type === Constants.deviceType.TELEVISION) {
      Corrections.hideBrowserOnDeviceTypeTelevision.call(this);
    }
    if (this.data.browser.name && this.data.device.type === Constants.deviceType.GAMING) {
      Corrections.hideBrowserOnDeviceTypeGaming.call(this);
    }
    if (this.data.device.type === Constants.deviceType.TELEVISION) {
      Corrections.hideOsOnDeviceTypeTelevision.call(this);
    }
    if (this.data.browser.name && this.data.engine.name) {
      Corrections.fixMidoriEngineName.call(this);
    }
    if (this.data.browser.name && this.data.engine.name) {
      Corrections.fixNineSkyEngineName.call(this);
    }
    if (this.data.browser.name && this.data.browser.family) {
      Corrections.hideFamilyIfEqualToBrowser.call(this);
    }
    return this;
  }

  static hideFamilyIfEqualToBrowser() {
    if (this.data.browser.name === this.data.browser.family.name) {
      this.data.browser.family = null;
    }
  }

  static fixMidoriEngineName() {
    if (this.data.browser.name === 'Midori' && this.data.engine.name !== 'Webkit') {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
    }
  }

  static fixNineSkyEngineName() {
    if (this.data.browser.name === 'NineSky' && this.data.engine.name !== 'Webkit') {
      this.data.engine.name = 'Webkit';
      this.data.engine.version = null;
    }
  }

  static hideBrowserBasedOnUsing() {
    if (this.data.browser.name === 'Chrome') {
      if (this.data.browser.isUsing('Electron') || this.data.browser.isUsing('Qt')) {
        this.data.browser.name = null;
        this.data.browser.version = null;
      }
    }
  }

  static hideBrowserBasedOnOperatingSystem() {
    if (this.data.os.name === 'Series60' && this.data.browser.name === 'Internet Explorer') {
      this.data.browser.reset();
      this.data.engine.reset();
    }
    if (this.data.os.name === 'Series80' && this.data.browser.name === 'Internet Explorer') {
      this.data.browser.reset();
      this.data.engine.reset();
    }
    if (this.data.os.name === 'Lindows' && this.data.browser.name === 'Internet Explorer') {
      this.data.browser.reset();
      this.data.engine.reset();
    }
    if (this.data.os.name === 'Tizen' && this.data.browser.name === 'Chrome') {
      this.data.browser.reset({
        family: this.data.browser.family ? this.data.browser.family : null,
      });
    }
    if (this.data.os.name === 'Ubuntu Touch' && this.data.browser.name === 'Chromium') {
      this.data.browser.reset({
        family: this.data.browser.family ? this.data.browser.family : null,
      });
    }
    if (this.data.os.name === 'KaiOS' && this.data.browser.name === 'Firefox Mobile') {
      this.data.browser.reset({
        family: this.data.browser.family ? this.data.browser.family : null,
      });
    }
  }

  static hideBrowserOnDeviceTypeGaming() {
    if (
      this.data.device.model &&
      this.data.device.model === 'Playstation 2' &&
      this.data.browser.name === 'Internet Explorer'
    ) {
      this.data.browser.reset();
    }
  }

  static hideBrowserOnDeviceTypeTelevision() {
    let valid;
    switch (this.data.browser.name) {
      case 'Firefox':
        if (!this.data.isOs('Firefox OS')) {
          this.data.browser.name = null;
          this.data.browser.version = null;
        }
        break;
      case 'Internet Explorer':
        valid = this.data.device.model && ['WebTV'].includes(this.data.device.model);
        if (!valid) {
          this.data.browser.name = null;
          this.data.browser.version = null;
        }
        break;
      case 'Chrome':
      case 'Chromium':
        valid = this.data.os.name && ['Google TV', 'Android'].includes(this.data.os.name);
        if (this.data.device.model && ['Chromecast'].includes(this.data.device.model)) {
          valid = true;
        }
        if (!valid) {
          this.data.browser.name = null;
          this.data.browser.version = null;
        }
        break;
    }
  }

  static hideOsOnDeviceTypeTelevision() {
    if (
      this.data.os.name &&
      ![
        'Aliyun OS',
        'Tizen',
        'Android',
        'Android TV',
        'FireOS',
        'Google TV',
        'Firefox OS',
        'OpenTV',
        'webOS',
      ].includes(this.data.os.name)
    ) {
      this.data.os.reset();
    }
  }
}

module.exports = Corrections;
