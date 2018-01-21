/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Ereader {
  static detectEreader(ua) {
    if (!/(Kindle|Nook|Bookeen|Kobo|EBRD|PocketBook|Iriver)/iu.test(ua)) {
      return;
    }

    Ereader.detectKindle.call(this, ua);
    Ereader.detectNook.call(this, ua);
    Ereader.detectBookeen.call(this, ua);
    Ereader.detectKobo.call(this, ua);
    Ereader.detectSonyreader.call(this, ua);
    Ereader.detectPocketbook.call(this, ua);
    Ereader.detectIriver.call(this, ua);
  }

  /* Amazon Kindle */

  static detectKindle(ua) {
    if (/Kindle/u.test(ua) && !/Fire/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Amazon',
        series: 'Kindle',
        type: Constants.deviceType.EREADER,
      });

      if (/Kindle SkipStone/u.test(ua)) {
        this.data.device.model = 'Kindle Touch or later';
      } else if (/Kindle\/3.0\+/u.test(ua)) {
        this.data.device.model = 'Kindle 3 or later';
      } else if (/Kindle\/3.0/u.test(ua)) {
        this.data.device.model = 'Kindle 3';
      } else if (/Kindle\/2.5/u.test(ua)) {
        this.data.device.model = 'Kindle 2';
      } else if (/Kindle\/2.0/u.test(ua)) {
        this.data.device.model = 'Kindle 2';
      } else if (/Kindle\/1.0/u.test(ua)) {
        this.data.device.model = 'Kindle 1';
      }

      if (this.data.device.model) {
        this.data.device.generic = false;
        this.data.device.series = null;
      }
    }
  }

  /* Barnes & Noble Nook */

  static detectNook(ua) {
    if (/nook browser/u.test(ua)) {
      this.data.os.reset({name: 'Android'});
      this.data.device.setIdentification({
        manufacturer: 'Barnes & Noble',
        series: 'NOOK',
        type: Constants.deviceType.EREADER,
      });
    }
  }

  /* Bookeen */

  static detectBookeen(ua) {
    if (/bookeen\/cybook/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Bookeen',
        series: 'Cybook',
        type: Constants.deviceType.EREADER,
      });
    }
  }

  /* Kobo */

  static detectKobo(ua) {
    if (/Kobo (eReader|Touch)/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Kobo',
        series: 'eReader',
        type: Constants.deviceType.EREADER,
      });
    }
  }

  /* Sony Reader */

  static detectSonyreader(ua) {
    let match;
    if ((match = /EBRD([0-9]+)/u.exec(ua))) {
      let model = null;

      switch (match[1]) {
        case '1101':
          model = 'PRS-T1';
          break;
        case '1102':
          model = 'PRS-G1';
          break;
        case '1201':
          model = 'PRS-T2';
          break;
        case '1301':
          model = 'PRS-T3';
          break;
      }

      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: model,
        series: 'Reader',
        type: Constants.deviceType.EREADER,
      });
    }
  }

  /* PocketBook */

  static detectPocketbook(ua) {
    let match;
    if ((match = /PocketBook\/([0-9]+)/u.exec(ua))) {
      let model = null;

      switch (match[1]) {
        case '515':
          model = 'Mini';
          break;
        case '614':
          model = 'Basic 2';
          break;
        case '622':
          model = 'Touch';
          break;
        case '623':
          model = 'Touch Lux';
          break;
        case '624':
          model = 'Basic Touch';
          break;
        case '626':
          model = 'Touch Lux 2';
          break;
        case '630':
          model = 'Sense';
          break;
        case '631':
          model = 'Touch HD';
          break;
        case '640':
          model = 'Aqua';
          break;
        case '641':
          model = 'Aqua 2';
          break;
        case '650':
          model = 'Ultra';
          break;
        case '801':
          model = 'Color Lux';
          break;
        case '840':
          model = 'InkPad';
          break;
      }

      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'PocketBook',
        model: model,
        type: Constants.deviceType.EREADER,
      });
    }
  }

  /* iRiver */

  static detectIriver(ua) {
    if (/Iriver ;/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'iRiver',
        series: 'Story',
        type: Constants.deviceType.EREADER,
      });

      if (/EB07/u.test(ua)) {
        this.data.device.model = 'Story HD EB07';
        this.data.device.series = null;
        this.data.device.generic = false;
      }
    }
  }
}

module.exports = Ereader;
