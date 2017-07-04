/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');
const Version = require('../../../../model/Version');

class Media {
  static detectMedia(ua) {
    if (!/(Archos|Zune|Walkman)/iu.test(ua)) {
      return;
    }
    Media.detectArchos.call(this, ua);
    Media.detectZune.call(this, ua);
    Media.detectWalkman.call(this, ua);
  }

  /* Archos Generation 4, 5 and 6 */
  static detectArchos(ua) {
    let match;
    /* Generation 4 */
    if ((match = /Archos A([67]04)WIFI\//u.exec(ua))) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Archos',
        model: `${match[1]} WiFi`,
        type: Constants.deviceType.MEDIA,
      });
    }
    /* Generation 5 */
    if ((match = /ARCHOS; GOGI; a([67]05f?);/u.exec(ua))) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Archos',
        model: `${match[1]} WiFi`,
        type: Constants.deviceType.MEDIA,
      });
    }
    /* Generation 6 without Android */
    if ((match = /ARCHOS; GOGI; G6-?(S|H|L|3GP);/u.exec(ua))) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Archos',
        type: Constants.deviceType.MEDIA,
      });
      switch (match[1]) {
        case '3GP':
          this.data.device.model = '5 3G+';
          break;
        case 'S':
        case 'H':
          this.data.device.model = '5';
          break;
        case 'L':
          this.data.device.model = '7';
          break;
      }
    }
    /* Generation 6 with Android */
    if ((match = /ARCHOS; GOGI; A5[SH]; Version ([0-9]\.[0-9])/u.exec(ua))) {
      const version = new Version({value: match[1]});
      this.data.os.reset({
        name: 'Android',
        version: new Version({value: version.is('<', '1.7') ? '1.5' : '1.6'}),
      });
      this.data.device.setIdentification({
        manufacturer: 'Archos',
        model: '5',
        type: Constants.deviceType.MEDIA,
      });
    }
  }

  /* Microsoft Zune */
  static detectZune(ua) {
    if (/Microsoft ZuneHD/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Microsoft',
        model: 'Zune HD',
        type: Constants.deviceType.MEDIA,
      });
    }
  }

  /* Sony Walkman */
  static detectWalkman(ua) {
    let match;
    if ((match = /Walkman\/(NW-[A-Z0-9]+)/u.exec(ua))) {
      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: `${match[1]} Walkman`,
        type: Constants.deviceType.MEDIA,
      });
    }
  }
}

module.exports = Media;
