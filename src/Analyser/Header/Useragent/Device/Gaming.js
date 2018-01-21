/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');

class Gaming {
  static detectGaming(ua) {
    if (!/(Nintendo|Nitro|PlayStation|PS[0-9]|Sega|Dreamcast|Xbox)/iu.test(ua)) {
      return;
    }

    Gaming.detectNintendo.call(this, ua);
    Gaming.detectPlaystation.call(this, ua);
    Gaming.detectXbox.call(this, ua);
    Gaming.detectSega.call(this, ua);
  }

  /* Nintendo Wii and DS */

  static detectNintendo(ua) {
    /* Switch */

    if (/Nintendo Switch/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'Switch',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Wii */

    if (/Nintendo Wii/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'Wii',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Wii U */

    if (/Nintendo Wii ?U/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'Wii U',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* DS */

    if (/Nintendo DS/u.test(ua) || /Nitro.*Opera/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'DS',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });
    }

    /* DSi */

    if (/Nintendo DSi/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'DSi',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });
    }

    /* 3DS */

    if (/Nintendo 3DS/u.test(ua)) {
      this.data.os.reset();
      this.data.os.identifyVersion(/Version\/([0-9.]*[0-9])/u, ua);

      this.data.engine.set({
        name: 'WebKit',
      });

      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: '3DS',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });
    }

    /* New 3DS */

    if (/New Nintendo 3DS/u.test(ua)) {
      this.data.os.reset();
      this.data.os.identifyVersion(/Version\/([0-9.]*[0-9])/u, ua);

      this.data.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'New 3DS',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });
    }
  }

  /* Sony PlayStation */

  static detectPlaystation(ua) {
    /* PlayStation Portable */

    if (/PlayStation Portable/u.test(ua)) {
      this.data.os.reset();

      this.data.engine.set({
        name: 'NetFront',
      });

      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: 'Playstation Portable',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });
    }

    /* PlayStation Vita */

    if (/PlayStation Vita/iu.test(ua)) {
      this.data.os.reset();
      this.data.os.identifyVersion(/PlayStation Vita ([0-9.]*)/u, ua);

      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: 'Playstation Vita',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.PORTABLE,
      });

      if (/VTE\//u.test(ua)) {
        this.data.device.model = 'Playstation TV';
        this.data.device.subtype = Constants.deviceSubType.CONSOLE;
      }
    }

    /* PlayStation 2 */

    if (/Playstation2/u.test(ua) || /\(PS2/u.test(ua)) {
      this.data.os.reset();

      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: 'Playstation 2',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* PlayStation 3 */

    if (/PlayStation 3/iu.test(ua) || /\(PS3/u.test(ua)) {
      this.data.os.reset();
      this.data.os.identifyVersion(/PLAYSTATION 3;? ([0-9.]*)/u, ua);

      if (/PLAYSTATION 3; [123]/.test(ua)) {
        this.data.engine.set({
          name: 'NetFront',
        });
      }

      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: 'Playstation 3',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* PlayStation 4 */

    if (/PlayStation 4/iu.test(ua) || /\(PS4/u.test(ua)) {
      this.data.os.reset();
      this.data.os.identifyVersion(/PlayStation 4 ([0-9.]*)/u, ua);

      this.data.device.setIdentification({
        manufacturer: 'Sony',
        model: 'Playstation 4',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }
  }

  /* Microsoft Xbox */

  static detectXbox(ua) {
    /* Xbox 360 */

    if (/Xbox\)$/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Microsoft',
        model: 'Xbox 360',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Xbox One */

    if (/Xbox One\)/u.test(ua)) {
      if (this.data.isOs('Windows Phone', '=', '10')) {
        this.data.os.name = 'Windows';
        this.data.os.version.alias = '10';
      }

      if (!this.data.isOs('Windows', '=', '10')) {
        this.data.os.reset();
      }

      this.data.device.setIdentification({
        manufacturer: 'Microsoft',
        model: 'Xbox One',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }
  }

  /* Sega */

  static detectSega(ua) {
    /* Sega Saturn */

    if (/SEGASATURN/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Sega',
        model: 'Saturn',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Sega Dreamcast */

    if (/Dreamcast/u.test(ua)) {
      this.data.os.reset();
      this.data.device.setIdentification({
        manufacturer: 'Sega',
        model: 'Dreamcast',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }
  }
}

module.exports = Gaming;
