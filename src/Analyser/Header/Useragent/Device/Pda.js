/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');
const Version = require('../../../../model/Version');
const Family = require('../../../../model/Family');
const DeviceModels = require('../../../../data/DeviceModels');

class Pda {
  static detectPda(ua) {
    if (!/(CASIO|Palm|Psion|pdQ|COM|airboard|sharp|pda|POCKET-E|OASYS|NTT\/PI)/iu.test(ua)) {
      return;
    }
    Pda.detectCasio.call(this, ua);
    Pda.detectPalm.call(this, ua);
    Pda.detectPsion.call(this, ua);
    Pda.detectSonyMylo.call(this, ua);
    Pda.detectSonyAirboard.call(this, ua);
    Pda.detectSharpZaurus.call(this, ua);
    Pda.detectSharpShoin.call(this, ua);
    Pda.detectPanasonicPocketE.call(this, ua);
    Pda.detectFujitsuOasys.call(this, ua);
    Pda.detectNttPetitWeb.call(this, ua);
  }

  /* Casio */
  static detectCasio(ua) {
    let match;
    if ((match = /Product=CASIO\/([^);]+)[);]/iu.exec(ua))) {
      this.data.device.manufacturer = 'Casio';
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.PDA;
      if (match[1] === 'CASSIOPEIA BE') {
        this.data.device.model = 'Cassiopeia';
      }
      if (match[1] === 'PPP101') {
        this.data.device.model = 'Pocket PostPet';
        this.data.device.carrier = 'DoCoMo';
      }
    }
  }

  /* Palm */
  static detectPalm(ua) {
    let match;
    let device;
    if ((match = /PalmOS/iu.exec(ua))) {
      this.data.os.name = 'Palm OS';
      this.data.device.type = Constants.deviceType.PDA;
      if ((match = /PalmOS ([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
      if ((match = /; ([^;)]+)\)/u.exec(ua))) {
        device = DeviceModels.identify('palmos', match[1]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if ((match = /PalmOS\/([a-z]+)\/model ([^/]+)\//iu.exec(ua))) {
        device = DeviceModels.identify('palmos', `${match[1]}-${match[2]}`);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
    if ((match = /Palm OS ([0-9.]*)/iu.exec(ua))) {
      this.data.os.name = 'Palm OS';
      this.data.os.version = new Version({value: match[1]});
      this.data.device.type = Constants.deviceType.PDA;
    }
    if ((match = /PalmSource/u.exec(ua))) {
      this.data.os.name = 'Palm OS';
      this.data.os.version = null;
      this.data.device.type = Constants.deviceType.PDA;
      if ((match = /PalmSource\/([^;]+)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.identified = Constants.id.PATTERN;
      }
      if (this.data.device.model) {
        device = DeviceModels.identify('palmos', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
    /* Some model markers */
    if (/PalmPilot Pro/iu.test(ua)) {
      this.data.device.manufacturer = 'Palm';
      this.data.device.model = 'Pilot Professional';
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
    if (/pdQbrowser/iu.test(ua)) {
      this.data.device.manufacturer = 'Kyocera';
      this.data.device.model = 'QCP-6035';
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* PSION */
  static detectPsion(ua) {
    let match;
    if (/Psion Cpw\//iu.test(ua)) {
      this.data.browser.name = 'WAP Browser';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.os.name = 'EPOC';
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.manufacturer = 'Psion';
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.PDA;
      if ((match = /\(([A-Z0-9]+)\)/u.exec(ua))) {
        switch (match[1]) {
          case 'S5':
            this.data.device.model = 'Series 5mx';
            break;
          case 'S7':
            this.data.device.model = 'Series 7';
            break;
          case 'RV':
            this.data.device.model = 'Revo';
            break;
        }
      }
    }
  }

  /* Sony Mylo */
  static detectSonyMylo(ua) {
    let match;
    if ((match = /SONY\/COM([0-9])/iu.exec(ua))) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.model = `Mylo ${match[1]}`;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.PDA;
      this.data.os.reset();
      if (/Qt embedded/iu.test(ua)) {
        this.data.os.name = 'Qtopia';
      }
    }
  }

  /* Sony Airboard */
  static detectSonyAirboard(ua) {
    let match;
    if ((match = /SONY\/airboard\/IDT-([A-Z0-9]+)/iu.exec(ua))) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.model = `Airboard ${match[1]}`;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.PDA;
    }
    if ((match = /LocationFreeTV; Airboard\/(LF-[A-Z0-9]+)/iu.exec(ua))) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.model = `Airboard ${match[1]}`;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.type = Constants.deviceType.PDA;
    }
  }

  /* Sharp Zaurus */
  static detectSharpZaurus(ua) {
    let match;
    if (/sharp pda browser\/([0-9.]+)/iu.test(ua)) {
      this.data.device.manufacturer = 'Sharp';
      this.data.device.model = 'Zaurus';
      this.data.device.type = Constants.deviceType.PDA;
      if ((match = /\(([A-Z0-9-]+)\/[0-9.]+\)/iu.exec(ua))) {
        this.data.device.model = `Zaurus ${match[1]}`;
        this.data.device.identified |= Constants.id.MATCH_UA;
        this.data.device.generic = false;
      }
    }
    if ((match = /\(PDA; (SL-[A-Z][0-9]+)\/[0-9.]/iu.exec(ua))) {
      this.data.device.manufacturer = 'Sharp';
      this.data.device.model = `Zaurus ${match[1]}`;
      this.data.device.type = Constants.deviceType.PDA;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }
  }

  /* Sharp Shoin (Word Processor) */
  static detectSharpShoin(ua) {
    let match;
    if (/sharp wd browser\/([0-9.]+)/iu.test(ua)) {
      this.data.device.manufacturer = 'Sharp';
      this.data.device.model = 'Mobile Shoin';
      this.data.device.type = Constants.deviceType.PDA;
      if ((match = /\(([A-Z0-9-]+)\/[0-9.]+\)/iu.exec(ua))) {
        this.data.device.model = `Mobile Shoin ${match[1]}`;
        this.data.device.identified |= Constants.id.MATCH_UA;
        this.data.device.generic = false;
      }
    }
  }

  /* Panasonic POCKET・E */
  static detectPanasonicPocketE(ua) {
    if (/Product=Panasonic\/POCKET-E/iu.test(ua)) {
      this.data.device.manufacturer = 'Panasonic';
      this.data.device.model = 'POCKET・E';
      this.data.device.type = Constants.deviceType.PDA;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }
  }

  /* Fujitsu OASYS */
  static detectFujitsuOasys(ua) {
    if (/Fujitsu; OASYS/iu.test(ua)) {
      this.data.device.manufacturer = 'Fujitsu';
      this.data.device.model = 'OASYS';
      this.data.device.type = Constants.deviceType.PDA;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
      if (/eNavigator/iu.test(ua)) {
        this.data.browser.name = 'eNavigator';
        this.data.browser.version = null;
        this.data.browser.type = Constants.browserType.BROWSER;
      }
    }
  }

  /* PetitWeb */
  static detectNttPetitWeb(ua) {
    let match;
    if ((match = /Product=NTT\/(PI-[0-9]+)/iu.exec(ua))) {
      this.data.device.manufacturer = 'NTT';
      this.data.device.model = `PetitWeb ${match[1]}`;
      this.data.device.type = Constants.deviceType.PDA;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }
  }
}

module.exports = Pda;
