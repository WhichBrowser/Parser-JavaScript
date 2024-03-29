/* eslint-disable require-jsdoc */
/* eslint-disable no-useless-escape */

const Constants = require('../../../../constants');
const Version = require('../../../../model/Version');
const Family = require('../../../../model/Family');
const DeviceModels = require('../../../../data/DeviceModels');

class Mobile {
  static detectMobile(ua) {
    /* Detect the type based on some common markers */
    Mobile.detectGenericMobile.call(this, ua);
    /* Look for specific manufacturers and models */
    Mobile.detectKin.call(this, ua);
    Mobile.detectNokia.call(this, ua);
    Mobile.detectSamsung.call(this, ua);
    /* Try to parse some generic methods to store device information */
    Mobile.detectGenericMobileModels.call(this, ua);
    Mobile.detectJapaneseMobileModels.call(this, ua);
    /* Try to find the model names based on id */
    Mobile.detectGenericMobileLocations.call(this, ua);
  }

  /* Generic markers */
  static detectGenericMobile(ua) {
    if (/(MIDP|CLDC|UNTRUSTED\/|3gpp-gba|[Ww][Aa][Pp]2.0|[Ww][Aa][Pp][ _-]?[Bb]rowser)/u.test(ua)) {
      this.data.device.type = Constants.deviceType.MOBILE;
    }
  }

  /* Microsoft KIN */
  static detectKin(ua) {
    let match;
    if ((match = /KIN\.(One|Two) ([0-9.]*)/iu.exec(ua))) {
      this.data.os.name = 'Kin OS';
      this.data.os.version = new Version({ value: match[2], details: 2 });
      switch (match[1]) {
        case 'One':
          this.data.device.manufacturer = 'Microsoft';
          this.data.device.model = 'Kin ONE';
          this.data.device.identified |= Constants.id.MATCH_UA;
          this.data.device.generic = false;
          break;
        case 'Two':
          this.data.device.manufacturer = 'Microsoft';
          this.data.device.model = 'Kin TWO';
          this.data.device.identified |= Constants.id.MATCH_UA;
          this.data.device.generic = false;
          break;
      }
    }
  }

  /* Nokia */
  static detectNokia(ua) {
    let match;
    let device;

    if (this.data.device.manufacturer) {
      return;
    }
    if ((match = /Nokia[- \/]?([^\/\);]+)/iu.exec(ua))) {
      if (match[1] === 'Browser') {
        return;
      }
      this.data.device.manufacturer = 'Nokia';
      this.data.device.model = DeviceModels.cleanup(match[1]);
      this.data.device.identifier = match[0];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.generic = false;
      this.data.device.type = Constants.deviceType.MOBILE;
      if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
        device = DeviceModels.identify('asha', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
          if (!this.data.os.name || this.data.os.name !== 'Nokia Asha Platform') {
            this.data.os.name = 'Nokia Asha Platform';
            this.data.os.version = new Version({ value: '1.0' });
            if ((match = /java_runtime_version=Nokia_Asha_([0-9_]+)[;)]/u.exec(ua))) {
              this.data.os.version = new Version({ value: match[1].replace(/_/g, '.') });
            }
          }
        }
      }
      if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
        device = DeviceModels.identify('s40', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
          if (!this.data.os.name || this.data.os.name !== 'Series40') {
            this.data.os.name = 'Series40';
            this.data.os.version = null;
          }
        }
      }
      if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
        device = DeviceModels.identify('symbian', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
          if (!this.data.os.name || this.data.os.name !== 'Series60') {
            this.data.os.name = 'Series60';
            this.data.os.version = null;
            this.data.os.family = new Family({ name: 'Symbian' });
          }
        }
      }
      Mobile.identifyBasedOnIdentifier.call(this);
    }
  }

  /* Samsung */
  static detectSamsung(ua) {
    let match;
    let device;
    let version;

    if (this.data.device.manufacturer) {
      return;
    }
    if ((match = /(?:SAMSUNG; )?SAMSUNG ?[-\/]?([^;\/\)_,]+)/iu.exec(ua))) {
      if (match[1] === 'Browser') {
        return;
      }
      this.data.device.manufacturer = 'Samsung';
      this.data.device.model = DeviceModels.cleanup(match[1]);
      this.data.device.identifier = match[0];
      this.data.device.identified |= Constants.id.PATTERN;
      this.data.device.generic = false;
      this.data.device.type = Constants.deviceType.MOBILE;
      if (this.data.isOs('Bada')) {
        device = DeviceModels.identify('bada', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (this.data.isOs('Series60')) {
        device = DeviceModels.identify('symbian', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
      if (!this.data.os.isDetected()) {
        if ((match = /Jasmine\/([0-9.]*)/u.exec(ua))) {
          version = match[1];
          device = DeviceModels.identify('touchwiz', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
            this.data.os.name = 'Touchwiz';
            switch (version) {
              case '0.8':
                this.data.os.version = new Version({ value: '1.0' });
                break;
              case '1.0':
                this.data.os.version = new Version({ value: '2.0', alias: '2.0 or earlier' });
                break;
            }
          }
        }
        if ((match = /(?:Dolfin\/([0-9.]*)|Browser\/Dolfin([0-9.]*))/u.exec(ua))) {
          version = match[1] ? match[1] : match[2];
          device = DeviceModels.identify('bada', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
            this.data.os.name = 'Bada';
            switch (version) {
              case '2.0':
                this.data.os.version = new Version({ value: '1.0' });
                break;
              case '2.2':
                this.data.os.version = new Version({ value: '1.2' });
                break;
            }
          } else {
            device = DeviceModels.identify('touchwiz', this.data.device.model);
            if (device.identified) {
              device.identified |= this.data.device.identified;
              this.data.device = device;
              this.data.os.name = 'Touchwiz';
              switch (version) {
                case '1.0':
                  this.data.os.version = new Version({ value: '2.0', alias: '2.0 or earlier' });
                  break;
                case '1.5':
                  this.data.os.version = new Version({ value: '2.0' });
                  break;
                case '2.0':
                  this.data.os.version = new Version({ value: '3.0' });
                  break;
              }
            }
          }
        }
      }
      Mobile.identifyBasedOnIdentifier.call(this);
    }
  }

  /* Generic models */
  static detectGenericMobileModels(ua) {
    let match;
    if (this.data.device.identified & Constants.id.PATTERN) {
      return;
    }
    if (this.data.device.manufacturer) {
      return;
    }
    if (
      !/(T-Mobile|Danger|HPiPAQ|Acer|Amoi|AIRNESS|ASUS|BenQ|maui|ALCATEL|Bird|COOLPAD|CELKON|Coship|Cricket|DESAY|Diamond|dopod|Ericsson|FLY|GIONEE|GT-|Haier|HIKe|Hisense|HS|HTC|T[0-9]{4,4}|HUAWEI|Karbonn|KWC|KONKA|KTOUCH|K-Touch|Lenovo|Lephone|LG|Micromax|MOT|Nexian|NEC|NGM|OPPO|Panasonic|Pantech|Philips|Sagem|Sanyo|Sam|SEC|SGH|SCH|SIE|Sony|SE|SHARP|Spice|Tecno|T-smart|TCL|Tiphone|Toshiba|UTStar|Videocon|vk|Vodafone|VSUN|Wynncom|Xiaomi|YUANDA|Zen|Ziox|ZTE|WAP)/iu.test(
        ua
      )
    ) {
      return;
    }
    this.data.device.identifyModel(/T-Mobile[_ ]([^\/;]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'T-Mobile',
    });
    this.data.device.identifyModel(/Danger hiptop ([0-9.]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Danger',
      model: 'Hiptop',
    });
    this.data.device.identifyModel(/HP(iPAQ[0-9A-Za-z]+)\//u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'HP',
    });
    this.data.device.identifyModel(/Acer[_-]?([^\s\/_]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Acer',
    });
    this.data.device.identifyModel(/Amoi[ -]([^\s\/_]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Amoi',
    });
    this.data.device.identifyModel(/AIRNESS-([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Airness',
    });
    this.data.device.identifyModel(/ASUS-([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Asus',
    });
    this.data.device.identifyModel(/BenQ[ -]([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'BenQ',
    });
    this.data.device.identifyModel(/ maui ([a-z0-9]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'BenQ',
      model: function (model) {
        return `Maui ${model.toUpperCase()}`;
      },
    });
    this.data.device.identifyModel(/ALCATEL[_-]([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Alcatel',
      model: function (model) {
        if ((match = /^TRIBE ([^\s]+)/iu.exec(model))) {
          model = `One Touch Tribe ${match[1]}`;
        } else if ((match = /^ONE TOUCH ([^\s]*)/iu.exec(model))) {
          model = `One Touch ${match[1]}`;
        } else if ((match = /^OT[-\s]*([^\s]*)/iu.exec(model))) {
          model = `One Touch ${match[1]}`;
        }
        return model;
      },
    });
    this.data.device.identifyModel(/Bird[ _\-\.]([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Bird',
    });
    this.data.device.identifyModel(/(?:YL-|YuLong-)?COOLPAD([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Coolpad',
    });
    this.data.device.identifyModel(/CELKON\.([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Celkon',
    });
    this.data.device.identifyModel(/Coship ([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Coship',
    });
    this.data.device.identifyModel(/Cricket-([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Cricket',
    });
    this.data.device.identifyModel(/DESAY[ _]([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'DESAY',
    });
    this.data.device.identifyModel(/Diamond_([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Diamond',
    });
    this.data.device.identifyModel(/dopod[-_]?([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Dopod',
    });
    this.data.device.identifyModel(/^Ericsson([^\/]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Ericsson',
    });
    this.data.device.identifyModel(/^(R[0-9]{3,3}) [0-9\.]+ WAP/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Ericsson',
    });
    this.data.device.identifyModel(/FLY_\]?([^\s\/]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Fly',
    });
    this.data.device.identifyModel(/GIONEE[-_ ]([^\s\/;]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Gionee',
    });
    this.data.device.identifyModel(/GIONEE([A-Z0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Gionee',
    });
    this.data.device.identifyModel(/HIKe_([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'HIKe',
    });
    this.data.device.identifyModel(/HAIER-([A-Z][0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Haier',
    });
    this.data.device.identifyModel(/Hisense[ -](?:HS-)?([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Hisense',
    });
    this.data.device.identifyModel(/HS-([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Hisense',
    });
    this.data.device.identifyModel(/HTC[\s_-]?([^\s\/\(\);][^\/\(\);]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'HTC',
    });
    this.data.device.identifyModel(/(?:HTC_)?([A-Z0-9_]+_T[0-9]{4,4})/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'HTC',
    });
    this.data.device.identifyModel(/HUAWEI[\s_-]?([^\/\)\()]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Huawei',
    });
    this.data.device.identifyModel(/Karbonn ([a-z0-9]+(?: ?Star| ?Plus|\+)?)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Karbonn',
    });
    this.data.device.identifyModel(/KWC-([^\s\/]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Kyocera',
    });
    this.data.device.identifyModel(/KONKA[-_]?([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Konka',
    });
    this.data.device.identifyModel(/TIANYU-KTOUCH\/([^\/]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'K-Touch',
    });
    this.data.device.identifyModel(/K-Touch_?([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'K-Touch',
    });
    this.data.device.identifyModel(/Lenovo[_-]?([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Lenovo',
    });
    this.data.device.identifyModel(/Lephone_([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Lephone',
    });
    this.data.device.identifyModel(/LGE?([A-Z]{2,2}[0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'LG',
    });
    this.data.device.identifyModel(/LGE?(?:\/|-|_)([^\s\)\-\[\/]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'LG',
    });
    this.data.device.identifyModel(/LGE? ?([A-Z]*[0-9]+[A-Z]?)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'LG',
    });
    this.data.device.identifyModel(/Micromax([^\)]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Micromax',
    });
    this.data.device.identifyModel(/^MOTO-?([^\/_]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Motorola',
    });
    this.data.device.identifyModel(/MOT-([^\/_\.]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Motorola',
    });
    this.data.device.identifyModel(/Motorola-([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Motorola',
      model: (model) => model.toUpperCase(),
    });
    this.data.device.identifyModel(/Motorola[_ ]([^\/_;\)]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Motorola',
    });
    this.data.device.identifyModel(/Moto([^\/\s_;r][^\/\s_;]*)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Motorola',
    });
    this.data.device.identifyModel(/Nexian([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Nexian',
    });
    this.data.device.identifyModel(/NEC-([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'NEC',
    });
    this.data.device.identifyModel(/NGM_([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'NGM',
    });
    this.data.device.identifyModel(/OPPO_([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Oppo',
    });
    this.data.device.identifyModel(/Panasonic-([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Panasonic',
    });
    this.data.device.identifyModel(/Pantech[-_]?([^\/_]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Pantech',
    });
    this.data.device.identifyModel(/Philips ?([A-Z]?[0-9@]+[a-z]?)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Philips',
    });
    this.data.device.identifyModel(/PHILIPS-([a-zA-Z0-9@]+(?: [0-9]+)?)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Philips',
      model: function (model) {
        if ((match = /Az@lis([0-9]{3,3})/iu.exec(model))) {
          return `Az@lis ${match[1]}`;
        }
        if ((match = /Fisio ?([0-9]{3,3})/iu.exec(model))) {
          return `Fisio ${match[1]}`;
        }
        return model;
      },
    });
    this.data.device.identifyModel(/SAGEM-([A-Z0-9\-]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sagem',
    });
    this.data.device.identifyModel(/Sanyo-([A-Z0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sanyo',
    });
    this.data.device.identifyModel(/sam-([A-Z][0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Samsung',
    });
    this.data.device.identifyModel(/SEC-(SGH[A-Z][0-9]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Samsung',
      model: (model) => model.replace('SGH', 'SGH-'),
    });
    this.data.device.identifyModel(/((?:SGH|SCH)-[A-Z][0-9]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Samsung',
    });
    this.data.device.identifyModel(/(GT-[A-Z][0-9]+[A-Z]?)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Samsung',
    });
    this.data.device.identifyModel(/(?:Siemens |SIE-)([A-Z]+[0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Siemens',
    });
    this.data.device.identifyModel(/SIE-([0-9]{4,4}|[A-Z]{4,4})/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Siemens',
    });
    this.data.device.identifyModel(/Sony ([A-Z0-9\-]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sony',
    });
    this.data.device.identifyModel(/SE([A-Z][0-9]+[a-z])/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sony Ericsson',
    });
    this.data.device.identifyModel(/sony-ericsson ([A-Z][0-9]+[a-z])/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sony Ericsson',
    });
    this.data.device.identifyModel(/SonyE?ricsson ?([^\/\);]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sony Ericsson',
      model: function (model) {
        if ((match = /^([A-Z]) ([0-9]+)$/u.exec(model))) {
          model = `${match[1]}${match[2]}`;
        }
        if (/^[a-z][0-9]+/u.test(model)) {
          model = `${model[0].toUpperCase()}${model.slice(1)}`;
        }
        return model;
      },
    });
    this.data.device.identifyModel(/SHARP[-_\/]([^\/;]*)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Sharp',
    });
    this.data.device.identifyModel(/Spice\s([^\s]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Spice',
    });
    this.data.device.identifyModel(/Spice\s?([A-Z][0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Spice',
    });
    this.data.device.identifyModel(/Tecno([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Tecno',
    });
    this.data.device.identifyModel(/T-smart_([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'T-smart',
    });
    this.data.device.identifyModel(/TCL[-_ ]([^\/;)]*)/iu, ua, {
      manufacturer: 'TCL',
    });
    this.data.device.identifyModel(/Tiphone ([^\/]*)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'TiPhone',
    });
    this.data.device.identifyModel(/Toshiba[-\/]([^\/-]*)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Toshiba',
    });
    this.data.device.identifyModel(/UTStar(?:com)?-([^\s\.\/;]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'UTStarcom',
    });
    this.data.device.identifyModel(/vk-(vk[0-9]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'VK Mobile',
      model: (model) => model.toUpperCase(),
    });
    this.data.device.identifyModel(/Videocon[-_ \/]([A-Z0-9\.]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Videocon',
    });
    this.data.device.identifyModel(/Vodafone(?:[ _-]Chat)?[ _-]?([0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Vodafone',
    });
    this.data.device.identifyModel(/Vodafone\/[0-9.]+\/(v[0-9]+)[^\/]*\//u, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Vodafone',
    });
    this.data.device.identifyModel(/^VSUN([0-9]+[A-Z]?)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Vsun',
    });
    this.data.device.identifyModel(/Wynncom[\-\s]([A-Z0-9\s]+\+?)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Wynncom',
    });
    this.data.device.identifyModel(/^YUANDA([0-9]+[A-Z]?)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Yuanda',
    });
    this.data.device.identifyModel(/^ZEN[_\s]([A-Z0-9\s\+]+?)\*?[\s_]?($|\/|-|;|Dorado|MAUI|WAP|R2AE|Q03C)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Zen',
    });
    this.data.device.identifyModel(/^(?:Ziox[_\s])?Ziox[_\s](ZX?[0-9]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'Ziox',
    });
    this.data.device.identifyModel(/ZTE[-_\s]?([^\s\/();,]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      manufacturer: 'ZTE',
      model: function (model) {
        return /[A-Z]+[0-9]+/iu.test(model) ? model.toUpperCase() : model;
      },
    });
    Mobile.identifyBasedOnIdentifier.call(this);
  }

  /* Japanese models */
  static detectJapaneseMobileModels(ua) {
    let match;
    let device;

    if (this.data.device.manufacturer) {
      return;
    }
    if (this.data.os.isFamily('Android')) {
      return;
    }
    /* Sometimes DoCoMo UA strings are (partially) encoded */
    if (/^DoCoMo/u.test(ua)) {
      ua = ua.replace(
        /\\x([0-9A-Fa-f]{2})/g,
        function (m) {
          return String.fromCharCode(parseInt(m.substring(2), 16));
        },
        ua
      );
      /* Replace non ascii charancter series with a ' ' */
      ua = ua.replace(/[^\u0000-\u007F]+/g, ' ');
    }
    /* First identify it based on id */
    let model = null;
    let manufacturer = null;
    let carrier = null;
    let falsepositive = false;
    let ids = {
      CA: 'Casio',
      DL: 'Dell',
      ER: 'Ericsson',
      HT: 'HTC',
      HW: 'Huawei',
      IA: 'Inventec',
      JR: 'JRC',
      KO: 'Kokusai',
      LC: 'Longcheer',
      NK: 'Nokia',
      NM: 'Nokia',
      KE: 'KES',
      SA: 'Sanyo',
      SC: 'Samsung',
      SS: 'Samsung',
      SH: 'Sharp',
      SE: 'Sony Ericsson',
      SO: 'Sony',
      ZT: 'ZTE',
      F: 'Fujitsu',
      D: 'Mitsubishi',
      J: 'JRC',
      K: 'Kyocera',
      L: 'LG',
      M: 'Motorola',
      N: 'NEC',
      P: 'Panasonic',
      R: 'JRC',
      T: 'Toshiba',
      Z: 'ZTE',
    };
    let joinedIdsKeys = Object.keys(ids).join('|');
    if ((match = new RegExp(`(?:^|[\\s\\/\\-\\(;])((${joinedIdsKeys})[0-9]{3,3}[a-z]+[A-Z]*)`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'DoCoMo';
    }
    if ((match = new RegExp(`(?:; |\\()((${joinedIdsKeys})[0-9]{2,2}[A-Z][0-9]?)[\\);]`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'DoCoMo';
    }
    if (
      (match = new RegExp(`DoCoMo\\/[0-9].0 ((${joinedIdsKeys})[0-9]{2,2}[A-Z][0-9]?)(?:\\s?\\(|$)`, 'u').exec(ua))
    ) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'DoCoMo';
    }
    if (
      (match = new RegExp(`DoCoMo\\/[0-9].0[\\/\\s](?:MST_v_)?((${joinedIdsKeys})[1-9][0-9]{3,3}[A-Z]?)`, 'u').exec(
        ua
      ))
    ) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'DoCoMo';
    }
    if ((match = new RegExp(`[\\/\\(]([SHW][0-9]{2,2}(${joinedIdsKeys}))[\\/;]`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'EMOBILE';
    }

    if ((match = new RegExp(`\\) ([SHW][0-9]{2,2}(${joinedIdsKeys}))$`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'EMOBILE';
    }
    if ((match = new RegExp(`[\\s\\/\\-\\(;](J-(${joinedIdsKeys})[0-9]{2,2})`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'Softbank';
    }
    if ((match = new RegExp(`(?:^|; |\\/)([0-9]{3,3}(${joinedIdsKeys}))[eps]?[\\/\\)]`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'Softbank';
    }
    if ((match = new RegExp(`\\(([0-9]{3,3}(${joinedIdsKeys})[eps]?);SoftBank`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'Softbank';
    }
    if ((match = new RegExp(`(?:^|[\\s\\/\\(;])((V|DM|W|WS|WX)[0-9]{2,3}(${joinedIdsKeys}))`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[3];
      switch (match[2]) {
        case 'V':
          carrier = 'Softbank';
          break;
        case 'DM':
          carrier = 'Disney Mobile';
          break;
        case 'W':
        case 'WS':
        case 'WX':
          carrier = 'Willcom';
          break;
      }
    }
    if ((match = new RegExp(`(AH-(${joinedIdsKeys})[1-9][0-9]{3,3}[A-Z]?)`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      carrier = 'Willcom';
    }
    if (['360SE'].includes(model)) {
      falsepositive = true;
    }
    if (!falsepositive && model && manufacturer) {
      this.data.device.reset({
        type: Constants.deviceType.MOBILE,
        model: model,
        carrier: carrier,
      });
      if (ids[manufacturer]) {
        this.data.device.manufacturer = ids[manufacturer];
      }
      this.data.device.identified |= Constants.id.PATTERN;
      /* Set flags for MOAP */
      switch (model) {
        case 'F06B':
        case 'F07B':
        case 'F08B':
        case 'SH07B':
          this.data.os.reset({ family: new Family({ name: 'Symbian' }) });
          this.data.device.flag = Constants.flag.MOAPS;
          break;
      }
      return;
    }
    /* Then KDDI model number */
    ids = {
      CA: 'Casio',
      DE: 'Denso',
      PT: 'Pantech',
      SA: 'Sanyo',
      ST: 'Sanyo',
      SH: 'Sharp',
      H: 'Hitachi',
      K: 'Kyocera',
      P: 'Panasonic',
      S: 'Sony Ericsson',
      T: 'Toshiba',
    };
    joinedIdsKeys = Object.keys(ids).join('|');
    if ((match = new RegExp(`(?:^|KDDI-)(W[0-9]{2,2}(${joinedIdsKeys}))[;\\)\\s\\/]`, 'u').exec(ua))) {
      model = match[1];
      manufacturer = match[2];
      this.data.device.reset({
        type: Constants.deviceType.MOBILE,
        model: model,
        carrier: 'au',
      });
      if (ids[manufacturer]) {
        this.data.device.manufacturer = ids[manufacturer];
      }
      this.data.device.identified |= Constants.id.PATTERN;
      return;
    }
    /* Then identify it based on KDDI id */
    ids = {
      CA: 'Casio',
      DN: 'Denso',
      ER: 'Ericsson',
      FJ: 'Fujitsu',
      HI: 'Hitachi',
      KC: 'Kyocera',
      MA: 'Panasonic',
      MI: 'Mitsubishi',
      PT: 'Pantech',
      SA: 'Sanyo',
      ST: 'Sanyo',
      SY: 'Sanyo',
      SH: 'Sharp',
      SN: 'Sony Ericsson',
      TS: 'Toshiba',
    };
    joinedIdsKeys = Object.keys(ids).join('|');
    if (
      (match = new RegExp(
        `(?:^|KDDI-|UP\\. ?Browser\\/[0-9\\.]+-|; )((${joinedIdsKeys})(?:[0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]))($|[;\\)\\s])`,
        'iu'
      ).exec(ua))
    ) {
      model = match[1].toUpperCase();
      manufacturer = match[2].toUpperCase();
      falsepositive = false;
      if (['MAM2', 'MAM3'].includes(model)) {
        falsepositive = true;
      }
      if (!falsepositive) {
        this.data.device.reset({
          type: Constants.deviceType.MOBILE,
          model: model,
          carrier: 'au',
        });
        if (ids[manufacturer]) {
          this.data.device.manufacturer = ids[manufacturer];
          device = DeviceModels.identify('kddi', model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            device.carrier = 'au';
            this.data.device = device;
          }
        }
        this.data.device.identified |= Constants.id.PATTERN;
        return;
      }
    }
    /* Finally identify it based on carrier */
    this.data.device.identifyModel(/\(([A-Z]+[0-9]+[A-Z])[^;]*; ?FOMA/iu, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'DoCoMo',
    });
    this.data.device.identifyModel(/\(FOMA ([^;]+)+;/u, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'DoCoMo',
    });
    this.data.device.identifyModel(/DoCoMo\/[0-9].0[\/\s]([0-9A-Z]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'DoCoMo',
    });
    this.data.device.identifyModel(/NTTDoCoMo ([0-9A-Z]+)/iu, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'DoCoMo',
    });
    this.data.device.identifyModel(/J-PHONE\/[^\/]+\/([^\/_]+)/u, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'Softbank',
    });
    this.data.device.identifyModel(/SoftBank\/[^\/]+\/([^\/]+)\//u, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'Softbank',
    });
    this.data.device.identifyModel(/Vodafone\/[0-9.]+\/V([0-9]+[A-Z]+)[^\/]*\//iu, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'Softbank',
    });
    this.data.device.identifyModel(/(KDDI-[^\s\)\.;]{4,})/iu, ua, {
      type: Constants.deviceType.MOBILE,
      carrier: 'au',
    });
    if (this.data.device.model) {
      Mobile.identifyBasedOnId.call(this, this.data.device.model);
    }
  }

  /* Device models not identified by a prefix */
  static detectGenericMobileLocations(ua) {
    if (this.data.device.identified & Constants.id.PATTERN) {
      return;
    }
    let candidates = [];
    let match;
    if ((match = /^([a-z0-9._+\/ ]+)_TD\//iu.exec(ua))) {
      candidates.push(match[1]);
    }
    if ((match = /^([a-z0-9_]+)/iu.exec(ua))) {
      candidates.push(match[1]);
    }
    if ((match = /[; ]\(?([^\s)\/;]+)[^\s;]*$/u.exec(ua))) {
      candidates.push(match[1]);
    }
    if ((match = /^([^\/)]+)/u.exec(ua))) {
      candidates.push(match[1]);
    }
    if ((match = /MobilePhone ([^\/)]+)/u.exec(ua))) {
      candidates.push(match[1]);
    }
    // prettier-ignore
    const compare = new Set([
      'Mobile', 'Safari', 'Version', 'GoogleTV', 'WebKit', 'NetFront',
      'Microsoft', 'ZuneWP7', 'Firefox', 'UCBrowser', 'IEMobile', 'Touch',
      'Fennec', 'Minimo', 'Gecko', 'TizenBrowser', 'Browser', 'sdk',
      'Mini', 'Fennec', 'Darwin', 'Puffin', 'Tanggula', 'Edge',
      'QHBrowser', 'BonEcho', 'Iceweasel', 'Midori', 'BeOS', 'UBrowser',
      'SeaMonkey', 'Model', 'Silk-Accelerated=true', 'Configuration',
      'UNTRUSTED', 'OSRE', 'Dolfin', 'Surf', 'Epiphany', 'Konqueror',
      'Presto', 'OWB', 'PmWFx', 'Netscape', 'Netscape6', 'Navigator',
      'Opera', 'Mozilla', 'BrightSign', 'Motorola', 'UCWEB',
      'NativeOperaMini', 'OperaMini', 'SogouMobileBrowser', 'iLunascape',
      'Sleipnir', 'MobileSafari', 'MQQBrowser', 'BREW', '?',
      'Maxthon', '360%20Browser', 'OPR', 'CFNetwork', 'JUC', 'Skyfire',
      'UP.Browser', 'DolphinHDCN', 'NintendoBrowser', 'NCSA',
      'NCSA Mosaic', 'NCSA_Mosaic', 'U', 'NetFrontNX', 'QtWebKit',
      'HtmlRenderer', 'HbbTV', 'WebAppManager', 'SmartTV', 'UPLUSTVBROWSER',
      'LG Browser', 'LG', 'LGSmartTV', 'OBIGO-T10', 'Linux', 'DLNADOC',
      'Aplix_SANYO_browser', 'Japanese', 'WebBrowser', 'Freetime',
      'OreganMediaBrowser', 'NETRANGEMMH', 'http:', 'bxapi', 'Kodi',
      'XBMC', 'KreaTVWebKit', 'MachBlue', 'Espial', 'TouchPad',
      'sharp', 'sharp wd browser', 'sharp pda browser', 'browser',
      'Palmscape', 'CorePlayer', 'Xiino', 'SONY', 'WorldTALK', 'TOPS',
      'Windows', 'Microsoft Pocket Internet Explorer', 'Explorer',
      'CE', 'Desktop', 'Maemo Browser', 'Maemo', 'baidubrowser',
      'Mercury', 'BREW-Applet', 'ucweb-squid', 'iSurf', '3gpp-gba',
      'InfoPath.2', 'UC', 'J2ME', 'IUC', 'AveFront', 'MMP', 'BaiduHD',
      '360%20Lite', '360', 'AppleWebKit', 'Instagram', 'FBOP',
      'Nuanti', 'NuantiMeta', 'Silk', 'VTE', 'DreamKey', 'DreamPassport',
      'Aplix_SEGASATURN_browser', 'NWF', 'Bunjalloo', 'libwww',
      'Inferno', 'NEXT', 'I', 'Microsoft Internet Explorer', 'MAM3',
      'MAM2', '360SE', 'Ziepod', 'Vista', 'XP', 'Links', 'Syllable',
      'sun4m', 'sun4c', 'sun4u', 'i86pc', 'X11', 'NaenaraBrowser',
      'QuickTime', 'IBM', 'QQBrowser', 'x86_64', 'i686', 'i386', 'Chrome',
      'TenFourFox', 'Swing', 'NetFrontBrowserNX', 'Mac_PowerPC',
      'NetCast.TV-2012', 'NetCast.TV-2011', 'NetCast.Media-2011',
      'PaleMoon', 'Fedora', 'SUSE', 'iCab', 'Googlebot', 'Pixi',
      'Pre', 'ELinks', 'developer', 'beta', 'BingPreview', 'IBrowse', '+http:',
    ]);
    candidates = [...new Set(candidates.filter((x) => !compare.has(x)))];

    for (let i = candidates.length - 1; i >= 0; i--) {
      if (/^[0-9.]+$/u.test(candidates[i])) {
        candidates.splice(i, 1);
        continue;
      }
      if (/^[0-9]+[xX][0-9]+$/u.test(candidates[i])) {
        candidates.splice(i, 1);
        continue;
      }
      if (/^\[?[a-z]{2}(-[a-z]{2})?\]?$/iu.test(candidates[i])) {
        candidates.splice(i, 1);
        continue;
      }
      if (candidates[i].length < 4) {
        candidates.splice(i, 1);
      }
    }
    for (const id of candidates) {
      Mobile.identifyBasedOnIdUsingOs.call(this, id);
      if (this.data.device.identified & Constants.id.MATCH_UA) {
        return;
      }
    }
  }

  static identifyBasedOnIdentifier() {
    if (this.data.device.identified & Constants.id.MATCH_UA) {
      return;
    }
    const ids = [];
    if (this.data.device.identifier) {
      ids.push(this.data.device.identifier);
    }
    if (this.data.device.model) {
      ids.push(this.data.device.model);
    }
    for (const id of ids) {
      Mobile.identifyBasedOnIdUsingOs.call(this, id);
      if (this.data.device.identified & Constants.id.MATCH_UA) {
        return;
      }
    }
    for (const id of ids) {
      Mobile.identifyBasedOnId.call(this, id);
      if (this.data.device.identified & Constants.id.MATCH_UA) {
        return;
      }
    }
  }

  static identifyBasedOnIdUsingOs(id) {
    let device;
    switch (this.data.os.getFamily()) {
      case 'Android':
        device = DeviceModels.identify('android', id);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
        break;
      case 'Brew':
        device = DeviceModels.identify('brew', id);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
        break;
      case 'Symbian':
        device = DeviceModels.identify('symbian', id);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
        break;
      case 'Windows':
      case 'Windows CE':
      case 'Windows Mobile':
        device = DeviceModels.identify('wm', id);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
          if (!this.data.isOs('Windows Mobile')) {
            this.data.os.reset({
              name: 'Windows Mobile',
            });
          }
        }
        break;
      default:
        device = DeviceModels.identify('feature', id);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
        break;
    }
  }

  static identifyBasedOnId(id) {
    let device;
    if (this.data.device.type !== 'mobile') {
      return;
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('brew', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
        if (!['Brew', 'Brew MP'].includes(this.data.os.name)) {
          this.data.os.name = 'Brew';
        }
      }
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('bada', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
        this.data.os.name = 'Bada';
      }
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('touchwiz', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
        this.data.os.name = 'Touchwiz';
      }
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('symbian', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
        this.data.os.reset({
          family: new Family({ name: 'Symbian' }),
        });
      }
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('wm', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
        this.data.os.name = 'Windows Mobile';
      }
    }
    if (!(this.data.device.identified & Constants.id.MATCH_UA)) {
      device = DeviceModels.identify('feature', id);
      if (device.identified) {
        device.identified |= this.data.device.identified;
        this.data.device = device;
      }
    }
  }
}

module.exports = Mobile;
