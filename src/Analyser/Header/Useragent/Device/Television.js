/* eslint-disable require-jsdoc */

const Constants = require('../../../../constants');
const Manufacturers = require('../../../../data/Manufacturers');

class Television {
  static detectTelevision(ua) {
    /* Detect the type based on some common markers */
    Television.detectGenericTelevision.call(this, ua);

    /* Try to parse some generic methods to store device information */
    Television.detectGenericTelevisionModels.call(this, ua);
    Television.detectGenericInettvBrowser.call(this, ua);
    Television.detectGenericHbbTV.call(this, ua);

    /* Look for specific manufacturers and models */
    Television.detectPanasonicTelevision.call(this, ua);
    Television.detectSharpTelevision.call(this, ua);
    Television.detectSamsungTelevision.call(this, ua);
    Television.detectSonyTelevision.call(this, ua);
    Television.detectPhilipsTelevision.call(this, ua);
    Television.detectLgTelevision.call(this, ua);
    Television.detectToshibaTelevision.call(this, ua);
    Television.detectSanyoTelevision.call(this, ua);

    /* Try to detect set top boxes from various manufacturers */
    Television.detectSettopboxes.call(this, ua);

    /* Improve model names */
    Television.improveModelsOnDeviceTypeTelevision.call(this);
  }

  /* Generic markers */

  static detectGenericTelevision(ua) {
    if (/CE-HTML/u.test(ua)) {
      this.data.device.type = Constants.deviceType.TELEVISION;
    }

    if (/SmartTvA\//u.test(ua)) {
      this.data.device.type = Constants.deviceType.TELEVISION;
    }

    if (/NETRANGEMMH/u.test(ua)) {
      this.data.device.type = Constants.deviceType.TELEVISION;
    }
  }

  /* Toshiba */

  static detectToshibaTelevision(ua) {
    if (/Toshiba_?TP\//u.test(ua) || /TSBNetTV ?\//u.test(ua)) {
      this.data.device.manufacturer = 'Toshiba';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
    let match;
    if ((match = /TOSHIBA;[^;]+;([A-Z]+[0-9]+[A-Z]+);/u.exec(ua))) {
      this.data.device.manufacturer = 'Toshiba';
      this.data.device.model = match[1];
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* LG */

  static detectLgTelevision(ua) {
    let match;
    if (/(LGSmartTV|LG smartTV)/u.test(ua)) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    if (/UPLUSTVBROWSER/u.test(ua)) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'U+ tv';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    /* NetCast */

    if ((match = /LG NetCast\.(TV|Media)-([0-9]*)/u.exec(ua))) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = `NetCast ${match[1]} ${match[2]}`;
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /LG Browser\/[0-9.]+\([^;]+; LGE; ([^;]+);/u.exec(ua))) {
        if (!match[1].startsWith('GLOBAL') && !match[1].startsWith('NETCAST')) {
          this.data.device.model = match[1];
        }
      }
    }

    /* NetCast */

    if (
      ua === 'Mozilla/5.0 (X11; Linux; ko-KR) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+' ||
      ua ===
        'Mozilla/5.0 (DirectFB; Linux; ko-KR) AppleWebKit/534.26 (KHTML, like Gecko) Version/5.0 Safari/534.26' ||
      ua ===
        'Mozilla/5.0 (DirectFB; Linux; ko-KR) AppleWebKit/534.26+ (KHTML, like Gecko) Version/5.0 Safari/534.26+'
    ) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'NetCast TV 2012';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    /* NetCast or WebOS */

    if (/NetCast/u.test(ua) && (match = /SmartTV\/([0-9])/u.exec(ua))) {
      this.data.device.manufacturer = 'LG';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if (parseInt(match[1], 10) < 5) {
        this.data.device.series = 'NetCast TV';
      } else {
        this.data.device.series = 'webOS TV';

        this.data.os.reset({
          name: 'webOS',
          hidden: true,
        });
      }
    }

    /* WebOS */

    if (/Web[O0]S/u.test(ua) && /Large Screen/u.test(ua)) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'webOS TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      this.data.os.reset({
        name: 'webOS',
        hidden: true,
      });
    }

    if (/Web[O0]S; Linux\/SmartTV/u.test(ua)) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'webOS TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      this.data.os.reset({
        name: 'webOS',
        hidden: true,
      });
    }

    if ((match = /webOS\.TV-([0-9]+)/u.exec(ua))) {
      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'webOS TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /LG Browser\/[0-9.]+\(LGE; ([^;]+);/u.exec(ua))) {
        if (!match[1].toUpperCase().startsWith('WEBOS')) {
          this.data.device.model = match[1];
        }
      }

      this.data.os.reset({
        name: 'webOS',
        hidden: true,
      });
    }

    if (/PBRM\//u.test(ua)) {
      this.data.browser.name = 'Pro:Centric';
      this.data.browser.version = null;

      this.data.device.manufacturer = 'LG';
      this.data.device.series = 'webOS TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /PBRM\/[0-9.]+ \( ;LGE ;([^;]+) ;/u.exec(ua))) {
        if (!match[1].toUpperCase().startsWith('WEBOS')) {
          this.data.device.model = match[1];
        }
      }

      this.data.os.reset({
        name: 'webOS',
        hidden: true,
      });
    }
  }

  /* Philips */

  static detectPhilipsTelevision(ua) {
    if (/NETTV\//u.test(ua)) {
      this.data.device.manufacturer = 'Philips';
      this.data.device.series = 'Net TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if (/AquosTV/u.test(ua)) {
        this.data.device.manufacturer = 'Sharp';
        this.data.device.series = 'Aquos TV';
      }

      if (/BANGOLUFSEN/u.test(ua)) {
        this.data.device.manufacturer = 'Bang & Olufsen';
        this.data.device.series = 'Smart TV';
      }

      if (/PHILIPS-AVM/u.test(ua)) {
        this.data.device.series = 'Blu-ray Player';
      }
    }

    if (/PHILIPS_OLS_20[0-9]+/u.test(ua)) {
      this.data.device.manufacturer = 'Philips';
      this.data.device.series = 'Net TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* Sony */

  static detectSonyTelevision(ua) {
    let match;
    if (/SonyCEBrowser/u.test(ua)) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /SonyCEBrowser\/[0-9.]+ \((?:BDPlayer; |DTV[0-9]+\/)?([^;_]+)/u.exec(ua))) {
        if (match[1] !== 'ModelName') {
          this.data.device.model = match[1];
        }
      }
    }

    if (/SonyDTV/u.test(ua)) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /(KDL-?[0-9]+[A-Z]+[0-9]+)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.generic = false;
      }

      if ((match = /(XBR-?[0-9]+[A-Z]+[0-9]+)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.generic = false;
      }
    }

    if (/SonyBDP/u.test(ua)) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.series = 'Blu-ray Player';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    if (/SmartBD/u.test(ua) && (match = /(BDP-[A-Z][0-9]+)/u.exec(ua))) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.model = match[1];
      this.data.device.series = 'Blu-ray Player';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    if (/\s+([0-9]+)BRAVIA/u.test(ua)) {
      this.data.device.manufacturer = 'Sony';
      this.data.device.model = 'Bravia';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* Samsung */

  static detectSamsungTelevision(ua) {
    let match;
    if (/(SMART-TV;|SmartHub;)/u.test(ua)) {
      this.data.device.manufacturer = 'Samsung';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /Linux\/SmartTV\+([0-9]*)/u.exec(ua))) {
        this.data.device.series = `Smart TV ${match[1]}`;
      } else if ((match = /Maple([0-9]*)/u.exec(ua))) {
        this.data.device.series = `Smart TV ${match[1]}`;
      }
    }

    if ((match = /Maple_?([0-9][0-9][0-9][0-9])/u.exec(ua))) {
      this.data.device.manufacturer = 'Samsung';
      this.data.device.series = `Smart TV ${match[1]}`;
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /Linux\/(?:SmartTV)?\+([0-9]{4,4})/u.exec(ua))) {
        this.data.device.series = `Smart TV ${match[1]}`;
      }
    }

    if ((match = /Maple ([0-9]+\.[0-9]+)\.[0-9]+/u.exec(ua))) {
      this.data.device.manufacturer = 'Samsung';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      switch (match[1]) {
        case '5.0':
          this.data.device.series = 'Smart TV 2009';
          break;
        case '5.1':
          this.data.device.series = 'Smart TV 2010';
          break;
        case '6.0':
          this.data.device.series = 'Smart TV 2011';
          break;
      }
    }

    if ((match = /Model\/Samsung-(BD-[A-Z][0-9]+)/u.exec(ua))) {
      this.data.device.manufacturer = 'Samsung';
      this.data.device.model = match[1];
      this.data.device.series = 'Blu-ray Player';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    if (/olleh tv;/u.test(ua)) {
      this.data.device.manufacturer = 'Samsung';
      this.data.device.model = null;
      this.data.device.series = null;
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /(SMT-[A-Z0-9]+)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.identifier = match[1];
        this.data.device.generic = false;
      }

      if (this.data.device.model === 'SMT-E5015') {
        this.data.device.model = 'Olleh SkyLife Smart Settopbox';
      }
    }
  }

  /* Sanyo */

  static detectSanyoTelevision(ua) {
    if (/Aplix_SANYO_browser/u.test(ua)) {
      this.data.device.manufacturer = 'Sanyo';
      this.data.device.series = 'Internet TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* Sharp */

  static detectSharpTelevision(ua) {
    if (/(AQUOSBrowser|AQUOS-(AS|DMP))/u.test(ua)) {
      this.data.device.manufacturer = 'Sharp';
      this.data.device.series = 'Aquos TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      let match;
      if ((match = /LC-([0-9]+[A-Z]+[0-9]+[A-Z]+)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.generic = false;
      }
    }
  }

  /* Panasonic */

  static detectPanasonicTelevision(ua) {
    if (/Viera/u.test(ua)) {
      let match;
      this.data.device.manufacturer = 'Panasonic';
      this.data.device.series = 'Viera';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /Panasonic\.tv\.(?:mid\.|pro4\.)?([0-9]+)/u.exec(ua))) {
        this.data.device.series = `Viera ${match[1]}`;
      }

      if ((match = /\(Panasonic, ([0-9]+),/u.exec(ua))) {
        this.data.device.series = `Viera ${match[1]}`;
      }

      if ((match = /Viera; rv:34/u.exec(ua))) {
        this.data.device.series = 'Viera 2015';
      }
    }

    if (/; Diga;/u.test(ua)) {
      this.data.device.manufacturer = 'Panasonic';
      this.data.device.series = 'Diga';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* Various set top boxes */

  static detectSettopboxes(ua) {
    if (
      !/(lacleTV|LOEWE|KreaTV|ADB|Mstar|TechniSat|Technicolor|Highway|CiscoBrowser|Sunniwell|Enseo|LocationFreeTV|Winbox|DuneHD|Roku|AppleTV|Apple TV|WebTV|OpenTV|MediStream)/iu.test(
        ua
      )
    ) {
      return;
    }

    let match;

    /* Orange La clé TV */

    if (/lacleTV\//u.test(ua)) {
      this.data.device.manufacturer = 'Orange';
      this.data.device.series = 'La clé TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    /* Loewe */

    if (/LOEWE\/TV/u.test(ua)) {
      this.data.device.manufacturer = 'Loewe';
      this.data.device.series = 'Smart TV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /((?:SL|ID)[0-9]+)/u.exec(ua))) {
        this.data.device.model = match[1];
      }
    }

    /* KreaTV */

    if (/KreaTV/u.test(ua)) {
      this.data.os.reset();

      this.data.device.series = 'KreaTV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;

      if (/Motorola/u.test(ua)) {
        this.data.device.manufacturer = 'Motorola';
      }
    }

    /* ADB */

    if ((match = /\(ADB; ([^)]+)\)/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'ADB';
      this.data.device.model = `${match[1] !== 'Unknown' ? `${match[1].replace('ADB', '')} ` : ''}IPTV receiver`;
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* MStar */

    if (/Mstar;/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'MStar';
      this.data.device.model = 'PVR';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    /* TechniSat */

    if ((match = /TechniSat ([^;]+);/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'TechniSat';
      this.data.device.model = match[1];
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Technicolor */

    if ((match = /Technicolor_([^;]+);/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Technicolor';
      this.data.device.model = match[1];
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Cisco MediaHighway */

    if (/(Media-Highway Evolution|CiscoBrowser\/CI)/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Cisco';
      this.data.device.model = 'MediaHighway';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Sunniwell */

    if (/Sunniwell/u.test(ua) && /Resolution/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Sunniwell';
      this.data.device.series = 'STB';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Enseo */

    if ((match = /Enseo\/([A-Z0-9]+)/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Enseo';
      this.data.device.model = match[1];
      this.data.device.series = 'STB';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Sony LocationFreeTV */

    if ((match = /LocationFreeTV\/([A-Z0-9-]+)/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Sony';
      this.data.device.model = `LocationFreeTV ${match[1]}`;
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Winbox Evo2 */

    if (/Winbox Evo2/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Winbox';
      this.data.device.model = 'Evo2';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* DuneHD */

    if (/DuneHD\//u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Dune HD';
      this.data.device.model = '';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /DuneHD\/[0-9.]+ \(([^;]+);/u.exec(ua))) {
        this.data.device.model = match[1];
      }
    }

    /* Roku  */

    if ((match = /^Roku\/DVP-(?:[0-9A-Z]+-)?[0-9.]+ \(([0-9]{2,2})/u.exec(ua))) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Roku';
      this.data.device.type = Constants.deviceType.TELEVISION;

      switch (match[1]) {
        case '02':
          this.data.device.model = '2 XS';
          this.data.device.generic = false;
          break;
        case '04':
          this.data.device.model = '3';
          this.data.device.generic = false;
          break;
        case '07':
          this.data.device.model = 'LT';
          this.data.device.generic = false;
          break;
        case '09':
          this.data.device.model = 'Streaming Stick';
          this.data.device.generic = false;
          break;
      }

      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    if (/\(Roku/u.test(ua)) {
      this.data.device.manufacturer = 'Roku';
      this.data.device.model = '';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
    }

    /* AppleTV */

    if (/Apple ?TV/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Apple';
      this.data.device.model = 'AppleTV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* WebTV */

    if (/WebTV\/[0-9.]/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Microsoft';
      this.data.device.model = 'WebTV';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* MediStream */

    if (/MediStream/u.test(ua)) {
      this.data.os.reset();

      this.data.device.manufacturer = 'Bewatec';
      this.data.device.model = 'MediStream';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }
  }

  /* Generic model information */

  static detectGenericTelevisionModels(ua) {
    let match;
    if ((match = /\(([^,(]+),\s*([^,(]+),\s*(?:[Ww]ired|[Ww]ireless)\)/u.exec(ua))) {
      const vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
      const modelName = match[2].trim();

      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.PATTERN;

      if (!this.data.device.series) {
        this.data.device.series = 'Smart TV';
      }

      switch (vendorName) {
        case 'ARRIS':
          this.data.device.manufacturer = 'Arris';
          this.data.device.model = modelName;
          break;

        case 'LG':
          this.data.device.manufacturer = 'LG';

          switch (modelName) {
            case 'WEBOS1':
            case 'webOS.TV':
              this.data.device.series = 'webOS TV';
              break;
            case 'NETCAST4':
            case 'NetCast4.0':
            case 'GLOBAL-PLAT4':
              this.data.device.series = 'NetCast TV 2013';
              break;
            default:
              this.data.device.model = modelName;
              break;
          }

          break;

        case 'Google Fiber':
          this.data.device.manufacturer = vendorName;
          this.data.device.model = 'TV Box';
          break;

        case 'Sagemcom':
          this.data.device.manufacturer = vendorName;
          this.data.device.series = 'Settopbox';

          if ((match = /^([A-Z]+[0-9]+)/iu.exec(modelName))) {
            this.data.device.model = match[1];
            this.data.device.series = null;
          }

          break;

        case 'TiVo':
          this.data.device.manufacturer = 'TiVo';
          this.data.device.series = 'DVR';
          break;

        default:
          this.data.device.manufacturer = vendorName;

          if (!['dvb'].includes(modelName)) {
            this.data.device.model = modelName;
          }

          break;
      }
    }
  }

  /* InettvBrowser model information */

  static detectGenericInettvBrowser(ua) {
    let match;
    if ((match = /(?:DTVNetBrowser|InettvBrowser|Hybridcast)\/[0-9.]+[A-Z]? ?\(/u.exec(ua))) {
      this.data.device.type = Constants.deviceType.TELEVISION;

      let vendorName = null;
      let modelName = null;
      let found = false;

      if ((match = /(?:DTVNetBrowser|InettvBrowser)\/[0-9.]+[A-Z]? ?\(([^;]*)\s*;\s*([^;]*)\s*;/u.exec(ua))) {
        vendorName = match[1].trim();
        modelName = match[2].trim();
        found = true;
      }

      if ((match = /Hybridcast\/[0-9.]+ ?\([^;]*;([^;]*)\s*;\s*([^;]*)\s*;/u.exec(ua))) {
        vendorName = match[1].trim();
        modelName = match[2].trim();
        found = true;
      }

      if (found) {
        this.data.device.identified |= Constants.id.PATTERN;

        const data = {
          '0003D5': 'Advanced Communications',
          '000024': 'Connect AS',
          '000087': 'Hitachi',
          '00A0B0': 'I-O Data Device',
          '00E091': 'LG',
          '0050C9': 'Maspro Denkoh',
          '002692': 'Mitsubishi',
          '38E08E': 'Mitsubishi',
          '008045': 'Panasonic',
          '00E036': 'Pioneer',
          '00E064': 'Samsung',
          '08001F': 'Sharp',
          '00014A': 'Sony',
          '000039': 'Toshiba',
        };

        if (data[vendorName]) {
          this.data.device.manufacturer = data[vendorName];

          if (this.data.device.manufacturer === 'LG') {
            switch (modelName) {
              case 'LGE2D2012M':
                this.data.device.series = 'NetCast TV 2012';
                break;
              case 'LGE3D2012M':
                this.data.device.series = 'NetCast TV 2012';
                break;
              case 'LGwebOSTV':
              case 'webOSTV3_0':
                this.data.device.series = 'webOS TV';
                break;
            }
          }

          if (this.data.device.manufacturer === 'Panasonic') {
            if (!modelName.startsWith('PANATV')) {
              this.data.device.model = modelName;
            }
          }
        }

        if (!this.data.device.series) {
          this.data.device.series = 'Smart TV';
        }
      }
    }
  }

  /* HbbTV model information */

  static detectGenericHbbTV(ua) {
    let match;
    if (/((HbbTV|OHTV|SmartTV)\/[0-9.]+|CE-HTML)/iu.test(ua)) {
      this.data.device.type = Constants.deviceType.TELEVISION;

      let vendorName = null;
      let modelName = null;
      let found = false;

      if ((match = /HbbTV\/[0-9.]+;CE-HTML\/[0-9.]+;([A-Z]+)\s([^;]+);/iu.exec(ua))) {
        vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
        modelName = match[2].trim();
        found = true;
      }

      if ((match = /UID\([a-f0-9:]+\/([^/]+)\/([^/]+)\/[0-9a-z.]+\)\+CE-HTML/iu.exec(ua))) {
        vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[2]);
        modelName = match[1].trim();
        found = true;
      }

      if ((match = /(?:HbbTV|OHTV)\/[0-9.]+ \(([^;]*);\s*([^;]*)\s*;\s*([^;]*)\s*;/u.exec(ua))) {
        match[1] = match[1].trim();
        if (match[1] === '' || ['PVR', 'DL'].includes(match[1].split(' ')[0]) || match[1].includes('+')) {
          vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[2]);
          modelName = match[3].trim();
        } else {
          vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
          modelName = match[2].trim();
        }

        found = true;
      }

      if ((match = /(?:^|\s)SmartTV\/[0-9.]+ \(([^;]*)\s*;\s*([^;]*)\s*;/u.exec(ua))) {
        vendorName = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
        modelName = match[2].trim();
        found = true;
      }

      if (
        [
          'Access',
          'ANT',
          'EMSYS',
          'Em-Sys',
          'Ocean Blue Software',
          'Opera',
          'Opera Software',
          'Seraphic',
          'ST',
          'Vendor',
        ].includes(vendorName)
      ) {
        found = false;
      }

      if (found) {
        this.data.device.identified |= Constants.id.PATTERN;

        switch (vendorName) {
          case 'LG':
            this.data.device.manufacturer = 'LG';

            switch (modelName) {
              case 'NetCast 3.0':
              case 'GLOBAL_PLAT3':
                this.data.device.series = 'NetCast TV 2012';
                break;
              case 'NetCast 4.0':
              case 'GLOBAL-PLAT4':
                this.data.device.series = 'NetCast TV 2013';
                break;
              case 'WEBOS1':
              case 'WEBOS2.0':
              case 'WEBOS3':
                this.data.device.series = 'webOS TV';
                break;
            }

            break;

          case 'Samsung':
            this.data.device.manufacturer = 'Samsung';

            switch (modelName) {
              case 'SmartTV2012':
                this.data.device.series = 'Smart TV 2012';
                break;
              case 'SmartTV2013':
                this.data.device.series = 'Smart TV 2013';
                break;
              case 'SmartTV2014':
                this.data.device.series = 'Smart TV 2014';
                break;
              case 'SmartTV2015':
                this.data.device.series = 'Smart TV 2015';
                break;
              case 'SmartTV2016':
                this.data.device.series = 'Smart TV 2016';
                break;
              case 'SmartTV2017':
                this.data.device.series = 'Smart TV 2017';
                break;
              case 'OTV-SMT-E5015':
                this.data.device.model = 'Olleh SkyLife Smart Settopbox';
                this.data.device.series = null;
                break;
            }

            break;

          case 'Panasonic':
            this.data.device.manufacturer = 'Panasonic';

            switch (modelName) {
              case 'VIERA 2011':
                this.data.device.series = 'Viera 2011';
                break;
              case 'VIERA 2012':
                this.data.device.series = 'Viera 2012';
                break;
              case 'VIERA 2013':
                this.data.device.series = 'Viera 2013';
                break;
              case 'VIERA 2014':
                this.data.device.series = 'Viera 2014';
                break;
              case 'VIERA 2015':
              case 'Viera2015.mid':
                this.data.device.series = 'Viera 2015';
                break;
              case 'VIERA 2016':
                this.data.device.series = 'Viera 2016';
                break;
              case 'VIERA 2017':
                this.data.device.series = 'Viera 2017';
                break;
              case 'SmartTV2018mid':
                this.data.device.series = 'Viera 2018';
                break;
              default:
                this.data.device.model = modelName;
                if ((modelName || '').startsWith('DIGA')) {
                  this.data.device.series = 'Diga';
                  this.data.device.model = null;
                }
                break;
            }

            break;

          case 'TV2N':
            this.data.device.manufacturer = 'TV2N';

            switch (modelName) {
              case 'videoweb':
                this.data.device.model = 'Videoweb';
                break;
            }

            break;

          default:
            if (vendorName !== '' && !['OEM', 'vendorName'].includes(vendorName)) {
              this.data.device.manufacturer = vendorName;
            }

            if (modelName !== '' && !['dvb', 'modelName', 'undefined-model-name', 'N/A'].includes(modelName)) {
              this.data.device.model = modelName;
            }

            break;
        }

        switch (modelName) {
          case 'hdr1000s':
            this.data.device.manufacturer = 'Humax';
            this.data.device.model = 'HDR-1000S';
            this.data.device.identified |= Constants.id.MATCH_UA;
            this.data.device.generic = false;
            break;

          case 'hdr4000t':
            this.data.device.manufacturer = 'Humax';
            this.data.device.model = 'HDR-4000T';
            this.data.device.identified |= Constants.id.MATCH_UA;
            this.data.device.generic = false;
            break;

          case 'hgs1000s':
            this.data.device.manufacturer = 'Humax';
            this.data.device.model = 'HGS-1000S';
            this.data.device.identified |= Constants.id.MATCH_UA;
            this.data.device.generic = false;
            break;

          case 'hms1000s':
          case 'hms1000sph2':
            this.data.device.manufacturer = 'Humax';
            this.data.device.model = 'HMS-1000S';
            this.data.device.identified |= Constants.id.MATCH_UA;
            this.data.device.generic = false;
            break;
        }
      }
    }

    if ((match = /HbbTV\/[0-9.]+;CE-HTML\/[0-9.]+;([^\s;]+)\s[^\s;]+;/u.exec(ua))) {
      this.data.device.manufacturer = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
      if (!this.data.device.series) {
        this.data.device.series = 'Smart TV';
      }
    }

    if ((match = /HbbTV\/[0-9.]+;CE-HTML\/[0-9.]+;Vendor\/([^\s;]+);/u.exec(ua))) {
      this.data.device.manufacturer = Manufacturers.identify(Constants.deviceType.TELEVISION, match[1]);
      if (!this.data.device.series) {
        this.data.device.series = 'Smart TV';
      }
    }
  }

  /* Try to reformat some of the detected generic models */

  static improveModelsOnDeviceTypeTelevision() {
    if (this.data.device.type !== Constants.deviceType.TELEVISION) {
      return;
    }

    let match;
    if (this.data.device.model && this.data.device.manufacturer) {
      if (this.data.device.manufacturer === 'Dune HD') {
        if ((match = /tv([0-9]+[a-z]?)/u.exec(this.data.device.model))) {
          this.data.device.model = `TV-${match[1].toUpperCase()}`;
        }

        if (this.data.device.model === 'connect') {
          this.data.device.model = 'Connect';
        }
      }

      if (this.data.device.manufacturer === 'Humax') {
        this.data.device.series = 'Digital Receiver';
      }

      if (this.data.device.manufacturer === 'Inverto') {
        if ((match = /IDL[ -]?([0-9]+.*)/u.exec(this.data.device.model))) {
          this.data.device.model = `IDL ${match[1]}`;
        }

        if ((match = /MBN([0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = `MBN ${match[1]}`;
        }
      }

      if (this.data.device.manufacturer === 'HyperPanel') {
        this.data.device.model = this.data.device.model.toUpperCase().split(' ')[0];
      }

      if (this.data.device.manufacturer === 'LG') {
        if ((match = /(?:ATSC|DVB)-(.*)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.generic = false;
        }

        if ((match = /[0-9][0-9]([A-Z][A-Z][0-9][0-9][0-9][0-9A-Z])/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.generic = false;
        }

        if ((match = /Media\/(.*)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Loewe') {
        this.data.device.series = 'Smart TV';

        if ((match = /((?:ID|SL)[0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = `Connect ${match[1]}`;
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Philips') {
        if ((match = /[0-9][0-9]([A-Z][A-Z][A-Z][0-9][0-9][0-9][0-9])/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.generic = false;
        }

        if ((match = /(MT[0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.series = 'Digital Receiver';
          this.data.device.generic = false;
        }

        if ((match = /(BDP[0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.series = 'Blu-ray Player';
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Toshiba') {
        if ((match = /DTV_(.*)/u.exec(this.data.device.model))) {
          this.data.device.model = `Regza ${match[1]}`;
          this.data.device.generic = false;
        }

        if ((match = /[0-9][0-9]([A-Z][A-Z][0-9][0-9][0-9])/u.exec(this.data.device.model))) {
          this.data.device.model = `Regza ${match[1]}`;
          this.data.device.generic = false;
        }

        if ((match = /[0-9][0-9](ZL[0-9])/u.exec(this.data.device.model))) {
          this.data.device.model = `${match[1]} Cevo`;
          this.data.device.generic = false;
        }

        if ((match = /(BDX[0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.series = 'Blu-ray Player';
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Selevision') {
        this.data.device.model = this.data.device.model.replace('Selevision ', '');
      }

      if (this.data.device.manufacturer === 'Sharp') {
        if ((match = /[0-9][0-9]([A-Z]+[0-9]+[A-Z]+)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Sony') {
        if ((match = /(BDP[0-9]+G)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.series = 'Blu-ray Player';
          this.data.device.generic = false;
        }

        if ((match = /KDL?-?[0-9]*([A-Z]+[0-9]+)[A-Z]*/u.exec(this.data.device.model))) {
          this.data.device.model = `Bravia ${match[1]}`;
          this.data.device.series = 'Smart TV';
          this.data.device.generic = false;
        }
      }

      if (this.data.device.manufacturer === 'Pioneer') {
        if ((match = /(BDP-[0-9]+)/u.exec(this.data.device.model))) {
          this.data.device.model = match[1];
          this.data.device.series = 'Blu-ray Player';
          this.data.device.generic = false;
        }
      }
    }
  }
}

module.exports = Television;
