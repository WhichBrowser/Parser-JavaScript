/* eslint-disable require-jsdoc */
/* eslint-disable no-useless-escape */

const Family = require('../../../model/Family');
const Version = require('../../../model/Version');
const Constants = require('../../../constants');
const Darwin = require('../../../data/Darwin');
const CFNetwork = require('../../../data/CFNetwork');
const DeviceModels = require('../../../data/DeviceModels');
const BuildIds = require('../../../data/BuildIds');
const Manufacturers = require('../../../data/Manufacturers');

class Os {
  static detectOperatingSystem(ua) {
    Os.detectUnix.call(this, ua);
    Os.detectLinux.call(this, ua);
    Os.detectBsd.call(this, ua);
    Os.detectDarwin.call(this, ua);
    Os.detectWindows.call(this, ua);
    Os.detectAndroid.call(this, ua);
    Os.detectChromeos.call(this, ua);
    Os.detectBlackberry.call(this, ua);
    Os.detectWebos.call(this, ua);
    Os.detectKaiOS.call(this, ua);
    Os.detectSymbian.call(this, ua);
    Os.detectNokiaOs.call(this, ua);
    Os.detectTizen.call(this, ua);
    Os.detectSailfish.call(this, ua);
    Os.detectBada.call(this, ua);
    Os.detectBrew.call(this, ua);
    Os.detectQtopia.call(this, ua);
    Os.detectOpenTV.call(this, ua);
    Os.detectRemainingOperatingSystems.call(this, ua);

    return this;
  }

  static refineOperatingSystem(ua) {
    Os.determineAndroidVersionBasedOnBuild.call(this, ua);

    return this;
  }

  /* Darwin */

  static detectDarwin(ua) {
    let match;
    let device;
    let version;
    /* iOS */

    if (/\(iOS;/u.test(ua)) {
      this.data.os.name = 'iOS';
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    if (/(iPhone|iPad|iPod)/u.test(ua) && !/like iPhone/u.test(ua)) {
      this.data.os.name = 'iOS';

      if (/CPU like Mac OS X/u.test(ua)) {
        this.data.os.version = new Version({value: '1.0'});
      }

      if ((match = /OS (.*) like Mac OS X/u.exec(ua))) {
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
        });
      }

      if ((match = /iPhone OS ([0-9._]*);/u.exec(ua))) {
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
        });
      }

      if (/iPhone Simulator;/u.test(ua)) {
        this.data.device.type = Constants.deviceType.EMULATOR;
      } else {
        if ((match = /(iPad|iPhone( 3GS| 3G| 4S| 4| 5)?|iPod( touch)?)/u.exec(ua))) {
          device = DeviceModels.identify('ios', match[0]);

          if (device) {
            this.data.device = device;
          }
        }

        if ((match = /(iPad|iPhone|iPod)1?[0-9],[0-9][0-9]?/u.exec(ua))) {
          device = DeviceModels.identify('ios', match[0]);

          if (device) {
            this.data.device = device;
          }
        }
      }
    } else if (/Mac OS X/u.test(ua) || /;os=Mac/u.test(ua)) {
      /* OS X */

      this.data.os.name = 'OS X';

      if ((match = /Mac OS X (10[0-9._]*)/u.exec(ua))) {
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
          details: 2,
        });
      }

      if ((match = /;os=Mac (10[0-9[.,]*)/u.exec(ua))) {
        this.data.os.version = new Version({
          value: match[1].replace(/,/g, '.'),
          details: 2,
        });
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* Darwin */

    if ((match = /Darwin(?:\/([0-9]+).[0-9]+)?/u.exec(ua))) {
      if (/\(X11;/u.test(ua)) {
        /* Darwin */
        this.data.os.name = 'Darwin';
        this.data.device.type = Constants.deviceType.DESKTOP;
      } else if (/\((?:x86_64|i386|Power%20Macintosh)\)/u.test(ua)) {
        /* OS X */
        this.data.os.name = 'OS X';
        this.data.device.type = Constants.deviceType.DESKTOP;

        if (match[1]) {
          version = Darwin.getVersion('osx', match[1]);
          if (version) {
            this.data.os.version = new Version(version);
          }

          if ((match = /CFNetwork\/([0-9\.]+)/u.exec(ua))) {
            version = CFNetwork.getVersion('osx', match[1]);
            if (version) {
              this.data.os.version = new Version(version);
            }
          }
        }
      } else {
        /* iOS */
        this.data.os.name = 'iOS';
        this.data.device.type = Constants.deviceType.MOBILE;

        if (match[1]) {
          version = Darwin.getVersion('ios', match[1]);
          if (version) {
            this.data.os.version = new Version(version);
          }

          if ((match = /CFNetwork\/([0-9\.]+)/u.exec(ua))) {
            version = CFNetwork.getVersion('ios', match[1]);
            if (version) {
              this.data.os.version = new Version(version);
            }
          }
        }
      }
    }

    /* Mac OS */

    if (/(; |\()Macintosh;/u.test(ua) && !/OS X/u.test(ua)) {
      this.data.os.name = 'Mac OS';
      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  /* Android */

  static detectAndroid(ua) {
    /* Android */
    let falsepositive;
    let match;
    let device;
    if (/Andr[0o]id/iu.test(ua)) {
      falsepositive = false;

      /* Prevent the Mobile IE 11 Franken-UA from matching Android */
      if (/IEMobile\/1/u.test(ua)) {
        falsepositive = true;
      }
      if (/Windows Phone 10/u.test(ua)) {
        falsepositive = true;
      }

      /* Prevent Windows 10 IoT Core from matching Android */
      if (/Windows IoT/u.test(ua)) {
        falsepositive = true;
      }

      /* Prevent from OSes that claim to be 'like' Android from matching */
      if (/like Android/u.test(ua)) {
        falsepositive = true;
      }
      if (/COS like Android/u.test(ua)) {
        falsepositive = false;
      }

      if (!falsepositive) {
        this.data.os.name = 'Android';
        this.data.os.version = new Version();

        if (
          (match = /Andr[0o]id(?: )?(?:AllPhone_|CyanogenMod_|OUYA )?(?:\/)?v?([0-9.]+)/iu.exec(
            ua.replace('-update', ',')
          ))
        ) {
          this.data.os.version = new Version({value: match[1], details: 3});
        }

        if ((match = /Android [0-9][0-9].[0-9][0-9].[0-9][0-9]\(([^)]+)\);/u.exec(ua.replace('-update', ',')))) {
          this.data.os.version = new Version({value: match[1], details: 3});
        }

        if (/Android Eclair/u.test(ua)) {
          this.data.os.version = new Version({value: '2.0', details: 3});
        }

        if (/Android KeyLimePie/u.test(ua)) {
          this.data.os.version = new Version({value: '4.4', details: 3});
        }

        if (/Android (?:L|4.4.99);/u.test(ua)) {
          this.data.os.version = new Version({
            value: '5',
            details: 3,
            alias: 'L',
          });
        }

        if (/Android (?:M|5.[01].99);/u.test(ua)) {
          this.data.os.version = new Version({
            value: '6',
            details: 3,
            alias: 'M',
          });
        }

        if (/Android (?:N|6.0.99);/u.test(ua)) {
          this.data.os.version = new Version({
            value: '7',
            details: 3,
            alias: 'N',
          });
        }

        this.data.device.type = Constants.deviceType.MOBILE;

        if (this.data.os.version.toFloat() >= 3) {
          this.data.device.type = Constants.deviceType.TABLET;
        }

        if (this.data.os.version.toFloat() >= 4 && /Mobile/u.test(ua)) {
          this.data.device.type = Constants.deviceType.MOBILE;
        }

        let candidates = [];

        if (/Build/iu.test(ua)) {
          /* Normal Android useragent strings */

          if ((match = /; [a-z][a-zA-Z][-_][a-zA-Z][a-zA-Z] ([^;]*[^;\s])\s+(?:BUILD|Build|build)/u.exec(ua))) {
            candidates.push(match[1]);
          }

          if (
            (match = /Android [A-Za-z]+; (?:[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?) Build\/([^\/]*)\//u.exec(ua))
          ) {
            candidates.push(match[1]);
          }

          if ((match = /;\+? ?(?:\*\*)?([^;]*[^;\s]);?\s+(?:BUILD|Build|build)/u.exec(ua))) {
            candidates.push(match[1]);
          }
        } else if (/Release\//iu.test(ua)) {
          /* WAP style useragent strings */
          const Useragent = require('../../Header/Useragent.js');
          // removed this regex  /^(?U)([^\/]+)(?U)(?:(?:_CMCC_TD|_CMCC|_TD|_TDLTE|_LTE)?\/[^\/]*)? Linux\/[0-9.+]+ Android\/[0-9.]+/u
          if (
            (match = /^([^\/]+?)(?:(?:_CMCC_TD|_CMCC|_TD|_TDLTE|_LTE)?\/[^\/]*?)? Linux\/[0-9.+]+? Android\/[0-9.]+?/u.exec(
              Useragent.removeKnownPrefixes(ua)
            ))
          ) {
            candidates.push(match[1]);
          } else if (
            (match = /^([^\/]+?)(?:(?:_CMCC_TD|_CMCC|_TD|_TDLTE|_LTE)?\/[^\/]*?)? Android(_OS)?\/[0-9.]+?/u.exec(
              Useragent.removeKnownPrefixes(ua)
            ))
          ) {
            candidates.push(match[1]);
          } else if (
            (match = /^([^\/]+?)(?:(?:_CMCC_TD|_CMCC|_TD|_TDLTE|_LTE)?\/[^\/]*?)? Release\/[0-9.]+?/u.exec(
              Useragent.removeKnownPrefixes(ua)
            ))
          ) {
            candidates.push(match[1]);
          }
        } else if (/Mozilla\//iu.test(ua)) {
          /* Old Android useragent strings */

          if (
            (match = /Linux; (?:U; )?Android [^;]+; (?:[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?; )?(?:[^;]+; ?)?([^)\/;]+)\)/u.exec(
              ua
            ))
          ) {
            candidates.push(match[1]);
          } else if ((match = /\(([^;]+);U;Android\/[^;]+;[0-9]+\*[0-9]+;CTC\/2.0\)/u.exec(ua))) {
            candidates.push(match[1]);
          }
        } else {
          /* Other applications */

          if ((match = /[34]G Explorer\/[0-9.]+ \(Linux;Android [0-9.]+,([^\)]+)\)/u.exec(ua))) {
            candidates.push(match[1]);
          }

          if ((match = /GetJarSDK\/.*android\/[0-9.]+ \([^;]+; [^;]+; ([^\)]+)\)$/u.exec(ua))) {
            candidates.push(match[1]);
          }
        }

        candidates = [...new Set(candidates)];

        for (let c = candidates.length - 1; c >= 0; c--) {
          if (/^[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?$/u.test(candidates[c])) {
            candidates.splice(c, 1);
            continue;
          }

          if (/^Android [0-9\.]+$/u.test(candidates[c])) {
            candidates.splice(c, 1);
            continue;
          }

          candidates[c] = candidates[c].replace(/^[a-zA-Z][a-zA-Z][-_][a-zA-Z][a-zA-Z]\s+/u, '');
          candidates[c] = candidates[c].replace(
            /(.*) - [0-9\.]+ - (?:with Google Apps - )?API [0-9]+ - [0-9]+x[0-9]+/,
            '$1'
          );
          candidates[c] = candidates[c].replace(/^sprd-/u, '');
        }

        candidates = [...new Set(candidates)];

        if (candidates.length) {
          this.data.device.model = candidates[0];
          this.data.device.identified |= Constants.id.PATTERN;

          for (let c = 0; c < candidates.length; c++) {
            device = DeviceModels.identify('android', candidates[c]);
            if (device.identified) {
              device.identified |= this.data.device.identified;
              this.data.device = device;
              break;
            }
          }
        }

        if (/HP eStation/u.test(ua)) {
          this.data.device.manufacturer = 'HP';
          this.data.device.model = 'eStation';
          this.data.device.type = Constants.deviceType.PRINTER;
          this.data.device.identified |= Constants.id.MATCH_UA;
          this.data.device.generic = false;
        }
      }
    }

    if (
      (match = /\(Linux; (?:U; )?(?:([0-9.]+); )?(?:[a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?; )?([^;]+) Build/u.exec(
        ua
      ))
    ) {
      falsepositive = false;

      if (match[2] === 'OpenTV') {
        falsepositive = true;
      }

      if (!falsepositive) {
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.device.model = match[2];

        this.data.os.name = 'Android';

        if (match[1]) {
          this.data.os.version = new Version({value: match[1], details: 3});
        }

        device = DeviceModels.identify('android', match[2]);
        if (device.identified) {
          device.identified |= Constants.id.PATTERN;
          device.identified |= this.data.device.identified;

          this.data.device = device;
        }
      }
    }

    if (
      (match = /Linux x86_64; ([^;\)]+)(?:; [a-zA-Z][a-zA-Z](?:[-_][a-zA-Z][a-zA-Z])?)?\) AppleWebKit\/534.24 \(KHTML, like Gecko\) Chrome\/11.0.696.34 Safari\/534.24/u.exec(
        ua
      ))
    ) {
      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= Constants.id.PATTERN;
        device.identified |= this.data.device.identified;

        this.data.os.name = 'Android';
        this.data.device = device;
      }
    }

    if ((match = /\(Linux; U; Linux Ventana; [^;]+; ([^;]+) Build/u.exec(ua))) {
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.model = match[1];

      device = DeviceModels.identify('android', match[1]);
      if (device.identified) {
        device.identified |= Constants.id.PATTERN;
        device.identified |= this.data.device.identified;

        this.data.os.name = 'Android';
        this.data.device = device;
      }
    }

    /* Aliyun OS */

    if (/Aliyun/u.test(ua) || /YunOs/iu.test(ua)) {
      this.data.os.name = 'Aliyun OS';
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.version = new Version();

      if ((match = /YunOs[ \/]([0-9.]+)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1], details: 3});
      }

      if ((match = /AliyunOS ([0-9.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1], details: 3});
      }

      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /; ([^;]*[^;\s])\s+Build/u.exec(ua))) {
        this.data.device.model = match[1];
      }

      if (this.data.device.model) {
        this.data.device.identified |= Constants.id.PATTERN;

        device = DeviceModels.identify('android', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    if (/Android/u.test(ua)) {
      if ((match = /Android v(1.[0-9][0-9])_[0-9][0-9].[0-9][0-9]-/u.exec(ua))) {
        this.data.os.name = 'Aliyun OS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = new Version({value: match[1], details: 3});
      }

      if ((match = /Android[ \/](1.[0-9].[0-9].[0-9]+)-R?T/u.exec(ua))) {
        this.data.os.name = 'Aliyun OS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = new Version({value: match[1], details: 3});
      }

      if ((match = /Android ([12].[0-9].[0-9]+)-R-20[0-9]+/u.exec(ua))) {
        this.data.os.name = 'Aliyun OS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = new Version({value: match[1], details: 3});
      }

      if ((match = /Android 20[0-9]+\./u.exec(ua))) {
        this.data.os.name = 'Aliyun OS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = null;
      }
    }

    /* Baidu Yi */

    if (/Baidu Yi/u.test(ua)) {
      this.data.os.name = 'Baidu Yi';
      this.data.os.family = new Family({name: 'Android'});
      this.data.os.version = null;
    }

    /* Google TV */

    if (/GoogleTV/u.test(ua)) {
      this.data.os.name = 'Google TV';
      this.data.os.family = new Family({name: 'Android'});

      this.data.device.type = Constants.deviceType.TELEVISION;

      if ((match = /GoogleTV [0-9\.]+; ?([^;]*[^;\s])\s+Build/u.exec(ua))) {
        this.data.device.model = match[1];
      }

      if (this.data.device.model) {
        this.data.device.identified |= Constants.id.PATTERN;

        device = DeviceModels.identify('android', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    /* LeOS */

    if (/LeOS/u.test(ua)) {
      this.data.os.name = 'LeOS';
      this.data.os.family = new Family({name: 'Android'});

      if ((match = /LeOS([0-9\.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.TABLET;

      if ((match = /LeOS[0-9\.]+; [^;]+; (.*) Build/u.exec(ua))) {
        this.data.device.model = match[1];
      }

      if (this.data.device.model) {
        this.data.device.identified |= Constants.id.PATTERN;

        device = DeviceModels.identify('android', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    /* WoPhone */

    if (/WoPhone/u.test(ua)) {
      this.data.os.name = 'WoPhone';
      this.data.os.family = new Family({name: 'Android'});

      if ((match = /WoPhone\/([0-9\.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* COS */

    if (/(COS|(China|Chinese) Operating System)/iu.test(ua)) {
      if ((match = /COS[\/ ]?([0-9]\.[0-9.]+)/iu.exec(ua))) {
        this.data.os.name = 'COS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = new Version({value: match[1], details: 2});
      } else if ((match = /(?:\(|; )(?:China|Chinese) Operating System ([0-9]\.[0-9.]*);/iu.exec(ua))) {
        this.data.os.name = 'COS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = new Version({value: match[1], details: 2});
      } else if ((match = /COS like Android/iu.exec(ua))) {
        this.data.os.name = 'COS';
        this.data.os.family = new Family({name: 'Android'});
        this.data.os.version = null;
        this.data.device.type = Constants.deviceType.MOBILE;
      } else if ((match = /(COS like Android|COSBrowser\/|\(COS;|\(COS 998;)/iu.exec(ua))) {
        this.data.os.name = 'COS';
        this.data.os.family = new Family({name: 'Android'});
      }
    }

    /* RemixOS */

    if (/RemixOS/u.test(ua)) {
      this.data.os.name = 'Remix OS';
      this.data.os.version = null;
      this.data.os.family = new Family({name: 'Android'});

      if ((match = /RemixOS ([0-9]\.[0-9])/u.exec(ua))) {
        switch (match[1]) {
          case '5.1':
            this.data.os.version = new Version({value: '1.0'});
            break;
          case '6.0':
            this.data.os.version = new Version({value: '2.0'});
            break;
        }
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  static determineAndroidVersionBasedOnBuild(ua) {
    let match;
    let version;
    if (this.data.isOs('Android')) {
      if ((match = /Build\/([^);]+)/u.exec(ua))) {
        version = BuildIds.identify(match[1]);
        if (version) {
          if (
            !this.data.os.version ||
            this.data.os.version === null ||
            this.data.os.version.value === null ||
            version.toFloat() < this.data.os.version.toFloat()
          ) {
            this.data.os.version = version;
          }

          /* Special case for Android L */
          if (version.toFloat() === 5) {
            this.data.os.version = version;
          }
        }

        this.data.os.build = match[1];
      }
    }
  }

  /* Windows */

  static detectWindows(ua) {
    let match;
    let device;
    if (/(Windows|WinNT|WinCE|WinMobile|Win ?[9MX]|Win(16|32))/u.test(ua)) {
      this.data.os.name = 'Windows';
      this.data.device.type = Constants.deviceType.DESKTOP;

      /* Windows NT */

      if (/Windows 2000/u.test(ua)) {
        this.data.os.version = new Version({value: '5.0', alias: '2000'});
      }

      if (/(Windows XP|WinXP)/u.test(ua)) {
        this.data.os.version = new Version({value: '5.1', alias: 'XP'});
      }

      if (/Windows Vista/u.test(ua)) {
        this.data.os.version = new Version({value: '6.0', alias: 'Vista'});
      }

      if ((match = /(?:Windows NT |WinNT)([0-9][0-9]?\.[0-9])/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});

        switch (match[1]) {
          case '10.1':
          case '10.0':
          case '6.4':
            this.data.os.version = new Version({
              value: match[1],
              alias: '10',
            });
            break;

          case '6.3':
            if (/; ARM;/u.test(ua)) {
              this.data.os.version = new Version({
                value: match[1],
                alias: 'RT 8.1',
              });
            } else {
              this.data.os.version = new Version({
                value: match[1],
                alias: '8.1',
              });
            }
            break;

          case '6.2':
            if (/; ARM;/u.test(ua)) {
              this.data.os.version = new Version({
                value: match[1],
                alias: 'RT',
              });
            } else {
              this.data.os.version = new Version({
                value: match[1],
                alias: '8',
              });
            }
            break;

          case '6.1':
            this.data.os.version = new Version({value: match[1], alias: '7'});
            break;
          case '6.0':
            this.data.os.version = new Version({
              value: match[1],
              alias: 'Vista',
            });
            break;
          case '5.2':
            this.data.os.version = new Version({
              value: match[1],
              alias: 'Server 2003',
            });
            break;
          case '5.1':
            this.data.os.version = new Version({
              value: match[1],
              alias: 'XP',
            });
            break;
          case '5.0':
            this.data.os.version = new Version({
              value: match[1],
              alias: '2000',
            });
            break;
          default:
            this.data.os.version = new Version({
              value: match[1],
              alias: `NT ${match[1]}`,
            });
            break;
        }

        Os.detectWindowsOemManufacturer.call(this, ua);
      }

      /* Windows 10 IoT Core */

      if ((match = /Windows IoT (1[0-9]\.[0-9]);/u.exec(ua))) {
        this.data.os.version = new Version({
          value: match[1],
          alias: '10 IoT Core',
        });
      }
      /* Windows */

      if (/(Windows 95|Win95)/u.test(ua)) {
        this.data.os.version = new Version({value: '4.0', alias: '95'});
      }

      if (/(Windows 98|Win98)/u.test(ua)) {
        this.data.os.version = new Version({value: '4.1', alias: '98'});
      }

      if (/(Windows M[eE]|WinME)/u.test(ua)) {
        this.data.os.version = new Version({value: '4.9', alias: 'ME'});
      }

      if ((match = /(?:Windows|Win 9x) (([1234]\.[0-9])[0-9\.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});

        switch (match[2]) {
          case '4.0':
            this.data.os.version = new Version({value: '4.0', alias: '95'});
            break;
          case '4.1':
            this.data.os.version = new Version({value: '4.1', alias: '98'});
            break;
          case '4.9':
            this.data.os.version = new Version({value: '4.9', alias: 'ME'});
            break;
        }
      }

      /* Windows Mobile and Windows Phone */

      if (/WPDesktop/u.test(ua)) {
        this.data.os.name = 'Windows Phone';
        this.data.os.version = new Version({value: '8.0', details: 2});
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.browser.mode = 'desktop';
      }

      if (/WP7/u.test(ua)) {
        this.data.os.name = 'Windows Phone';
        this.data.os.version = new Version({value: '7', details: 1});
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.browser.mode = 'desktop';
      }

      if (/WinMobile/u.test(ua)) {
        this.data.os.name = 'Windows Mobile';
        this.data.device.type = Constants.deviceType.MOBILE;

        if ((match = /WinMobile\/([0-9.]*)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});
        }
      }

      if (/(Windows CE|WindowsCE|WinCE)/u.test(ua)) {
        this.data.device.type = Constants.deviceType.MOBILE;

        if (/ IEMobile/u.test(ua)) {
          this.data.os.name = 'Windows Mobile';

          if (/ IEMobile\/9/u.test(ua)) {
            this.data.os.name = 'Windows Phone';
            this.data.os.version = new Version({value: '7.5', details: 2});
          }

          if (/ IEMobile 8/u.test(ua)) {
            this.data.os.version = new Version({value: '6.5', details: 2});
          }

          if (/ IEMobile 7/u.test(ua)) {
            this.data.os.version = new Version({value: '6.1', details: 2});
          }

          if (/ IEMobile 6/u.test(ua)) {
            this.data.os.version = new Version({value: '6.0', details: 2});
          }
        } else {
          this.data.os.name = 'Windows CE';

          if ((match = /WindowsCEOS\/([0-9.]*)/u.exec(ua))) {
            this.data.os.version = new Version({value: match[1], details: 2});
          }

          if ((match = /Windows CE ([0-9.]*)/u.exec(ua))) {
            this.data.os.version = new Version({value: match[1], details: 2});
          }
        }

        let model = null;

        if (
          !model &&
          (match = /IEMobile [0-9.]+\)\s{1,2}(?:PPC; |SP; |Smartphone; )?(?:[0-9]+[Xx][0-9]+;? )?(?:VZW; )?([^;\(]+)/u.exec(
            ua
          ))
        ) {
          if (!/(Profile\/MIDP|UNTRUSTED)/u.test(match[1])) {
            model = match[1];
          }
        }

        if (
          !model &&
          (match = /IEMobile [0-9.]+\) (?:PPC|SP|Smartphone); (?:[0-9]+[Xx][0-9]+;? )([^;]+) Profile\/MIDP/u.exec(
            ua
          ))
        ) {
          model = match[1];
        }

        if (
          !model &&
          (match = /MSIE [0-9.]+; Windows CE; (?:PPC|SP|Smartphone); [0-9]+x[0-9]+; ([^;\)]+)\)$/u.exec(ua))
        ) {
          model = match[1];
        }

        if (
          !model &&
          (match = /MSIE [0-9.]+; Windows CE; (?:PPC|SP|Smartphone); [0-9]+x[0-9]+; ([^;]+); (?:PPC|OpVer)/u.exec(
            ua
          ))
        ) {
          model = match[1];
        }

        if (!model && (match = /MSIE [0-9.]+; Windows CE; (?:PPC|SP|Smartphone); ([^;]+) Profile\/MIDP/u.exec(ua))) {
          model = match[1];
        }

        if (
          !model &&
          (match = /MSIE [0-9.]+; Windows CE; (?:PPC|SP|Smartphone) ([^;\(]+)[;\/] [0-9]+x[0-9]+/u.exec(ua))
        ) {
          model = match[1];
        }

        if (!model && (match = /MSIE [0-9.]+; Windows CE; ([^;\(]+); [0-9]+x[0-9]+\)/u.exec(ua))) {
          if (!/^(Smartphone|PPC$)/u.test(match[1])) {
            model = match[1];
          }
        }

        if (
          !model &&
          (match = /MSIE [0-9.]+; Windows CE; ([^;\(]+);? ?(?:PPC|SP|Smartphone); ?[0-9]+x[0-9]+/u.exec(ua))
        ) {
          if (!/^(MIDP-2.0)/u.test(match[1])) {
            model = match[1];
          }
        }

        if (
          !model &&
          (match = /MSIE [0-9.]+; Windows CE; ([^;\)]+)(?:; (?:PPC|SP|Smartphone); [0-9]+x[0-9]+)?\)( \[[a-zA-Z\-]+\])?$/u.exec(
            ua
          ))
        ) {
          if (!/^(IEMobile|MIDP-2.0|Smartphone|PPC$)/u.test(match[1])) {
            model = match[1];
          }
        }

        if (model) {
          model = model.replace(/(HTC\/|Toshiba\/)/, '');

          this.data.device.model = model;
          this.data.device.identified |= Constants.id.PATTERN;
          this.data.os.name = 'Windows Mobile';

          device = DeviceModels.identify('wm', model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        } else {
          if (
            !model &&
            (match = /Windows CE [^;]+; Trident\/[^;]+; IEMobile[\/ ][^;]+[\);] ([A-Z\s]+); ?([^\/\),]+)/iu.exec(ua))
          ) {
            model = match[2];
          }

          if (model) {
            this.data.device.model = model;
            this.data.device.identified |= Constants.id.PATTERN;
            this.data.os.name = 'Windows Phone';

            device = DeviceModels.identify('wp', model);
            if (device.identified) {
              device.identified |= this.data.device.identified;
              this.data.device = device;
            }
          }
        }
      }

      if (/Microsoft Windows; (PPC|Smartphone)/u.test(ua)) {
        this.data.os.name = 'Windows Mobile';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (/Windows CE; (PPC|Smartphone)/u.test(ua)) {
        this.data.os.name = 'Windows Mobile';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      /* Detect models in common places */

      if (/Windows ?Mobile/u.test(ua)) {
        this.data.os.name = 'Windows Mobile';
        this.data.device.type = Constants.deviceType.MOBILE;

        if ((match = /Windows ?Mobile[\/ ]([0-9.]*)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});
        }

        if ((match = /Windows Mobile; (?:SHARP\/)?([^;]+); (?:PPC|Smartphone);/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wm', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        if ((match = /\(([^;]+); U; Windows Mobile/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wm', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }

      if (/(Windows Phone|Windows NT 1[0-9]\.[0-9]; ARM|WPDesktop|ZuneWP7)/u.test(ua)) {
        this.data.os.name = 'Windows Phone';
        this.data.device.type = Constants.deviceType.MOBILE;

        if ((match = /Windows Phone(?: OS)?[ \/]([0-9.]*)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});

          if (parseInt(match[1], 10) < 7) {
            this.data.os.name = 'Windows Mobile';
          }
        }

        /* Windows Mobile 6.5 */
        if ((match = /Windows NT 5.1; ([^;]+); Windows Phone/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wm', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Windows Phone 7 (buggy) */
        if (
          (match = /Windows Phone OS [^;]+; Trident\/[^;]+; IEMobile[\/ ][^;]+[\);] ([A-Z\s]+); ?([^\/\),]+)/iu.exec(
            ua
          ))
        ) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[2]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Windows Phone 7 and 8 */
        if (
          (match = /IEMobile\/[^;]+;(?: ARM; Touch; )?(?:rv:[0-9]+; )?(?: WpsLondonTest; )?\s*([^;\s][^;\)]*);\s*([^;\)\s][^;\)]*)[;|\)]/u.exec(
            ua
          ))
        ) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[2]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Windows Phone 10 */
        if (
          (match = /Windows Phone 1[0-9]\.[0-9]; Android [0-9\.]+; (?:WebView\/[0-9\.]+; )?([^;\s][^;]*);\s*([^;\)\s][^;\)]*)[;|\)]/u.exec(
            ua
          ))
        ) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[2]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Windows Phone 10 Continuum */
        if ((match = /Windows NT 1[0-9]\.[0-9]; ARM; ([^;\)\s][^;\)]*)\)/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }

          this.data.device.type = Constants.deviceType.DESKTOP;
        }

        /* Third party browsers */
        if (
          (match = /IEMobile\/[^;]+;(?: ARM; Touch; )?\s*(?:[^\/]+\/[^\/]+);\s*([^;\s][^;]*);\s*([^;\)\s][^;\)]*)[;|\)]/u.exec(
            ua
          ))
        ) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[2]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        if ((match = /\(Windows Phone OS\/[0-9.]+; ([^:]+):([^;]+); [a-z]+(?:-[a-z]+)?\)/iu.exec(ua))) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[2]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Desktop mode of WP 8.1 */
        if ((match = /WPDesktop;\s*([^;\)]*)(?:;\s*([^;\)]*))?(?:;\s*([^;\)]*))?\) like Gecko/u.exec(ua))) {
          if (/^[A-Z]+$/.test(match[1]) && match[2]) {
            this.data.device.manufacturer = match[1];
            this.data.device.model = match[2];
          } else {
            this.data.device.model = match[1];
          }

          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Desktop mode of WP 7 */
        if ((match = /XBLWP7; ZuneWP7; ([^\)]+)\)/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        /* Desktop mode of WP 8.0 and 8.1 Update (buggy version) */
        if ((match = /Touch; WPDesktop;\s*([^;\)]*)(?:;\s*([^;\)]*))?(?:;\s*([^;\)]*))?\)/u.exec(ua))) {
          if (/^[A-Z]+$/.test(match[1]) && match[2]) {
            this.data.device.manufacturer = match[1];
            this.data.device.model = match[2];
          } else {
            this.data.device.model = match[1];
          }

          this.data.device.identified |= Constants.id.PATTERN;

          device = DeviceModels.identify('wp', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        if (this.data.device.manufacturer && this.data.device.model) {
          if (this.data.device.manufacturer === 'ARM' && this.data.device.model === 'Touch') {
            this.data.device.manufacturer = null;
            this.data.device.model = null;
            this.data.device.identified = Constants.id.NONE;
          }

          if (this.data.device.model === 'XDeviceEmulator') {
            this.data.device.manufacturer = null;
            this.data.device.model = null;
            this.data.device.type = Constants.deviceType.EMULATOR;
            this.data.device.identified |= Constants.id.MATCH_UA;
          }
        }
      }
    } else if (/WMPRO/u.test(ua)) {
      this.data.os.name = 'Windows Mobile';
      this.data.device.type = Constants.deviceType.MOBILE;
    }
  }

  static detectWindowsOemManufacturer(ua) {
    const manufacturers = {
      MAAR: 'Acer',
      ASJB: 'Asus',
      ASU2: 'Asus',
      MAAU: 'Asus',
      NP06: 'Asus',
      NP07: 'Asus',
      NP08: 'Asus',
      NP09: 'Asus',
      CMNTDF: 'Compaq',
      CPDTDF: 'Compaq',
      CPNTDF: 'Compaq',
      MDDR: 'Dell',
      MDDC: 'Dell',
      MDDS: 'Dell',
      FSJB: 'Fujitsu',
      MAFS: 'Fujitsu',
      MAGW: 'Gateway',
      HPCMHP: 'HP',
      HPDTDF: 'HP',
      HPNTDF: 'HP',
      MANM: 'Hyrican',
      LCJB: 'Lenovo',
      LEN2: 'Lenovo',
      MALC: 'Lenovo',
      MALE: 'Lenovo',
      MALN: 'Lenovo',
      MAMD: 'Medion',
      MAMI: 'MSI',
      MAM3: 'MSI',
      MASM: 'Samsung',
      SMJB: 'Samsung',
      MASA: 'Sony',
      MASE: 'Sony',
      MASP: 'Sony',
      MATB: 'Toshiba',
      MATM: 'Toshiba',
      MATP: 'Toshiba',
      TAJB: 'Toshiba',
      TNJB: 'Toshiba',
    };

    const keys = Object.keys(manufacturers);
    let match;
    if ((match = new RegExp(`; (${keys.join('|')})(?:JS)?[\);]`, 'u').exec(ua))) {
      this.data.device.manufacturer = manufacturers[match[1]];
      this.data.device.hidden = true;
      this.data.device.identified |= Constants.id.INFER;
    }
  }

  /* Jolla Sailfish */

  static detectSailfish(ua) {
    if (/Sailfish;/u.test(ua)) {
      this.data.os.name = 'Sailfish';
      this.data.os.version = null;

      if (/Jolla;/u.test(ua)) {
        this.data.device.manufacturer = 'Jolla';
      }

      if (/Mobile/u.test(ua)) {
        this.data.device.model = 'Phone';
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.device.identified = Constants.id.PATTERN;
      }

      if (/Tablet/u.test(ua)) {
        this.data.device.model = 'Tablet';
        this.data.device.type = Constants.deviceType.TABLET;
        this.data.device.identified = Constants.id.PATTERN;
      }
    }
  }

  /* Bada */

  static detectBada(ua) {
    let match;
    let device;
    if (/[b|B]ada/u.test(ua)) {
      this.data.os.name = 'Bada';

      if ((match = /[b|B]ada[\/ ]([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1], details: 2});
      }

      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /\(([^;]+); ([^\/]+)\//u.exec(ua))) {
        if (match[1] !== 'Bada') {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified = Constants.id.PATTERN;

          device = DeviceModels.identify('bada', match[2]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }
    }
  }

  /* Tizen */

  static detectTizen(ua) {
    let match;
    let device;
    if (/Tizen/u.test(ua)) {
      this.data.os.name = 'Tizen';

      if ((match = /Tizen[\/ ]?([0-9.]*[0-9])/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /\(([^;]+); ([^\/]+)\//u.exec(ua))) {
        let falsepositive = false;
        if (match[1].toUpperCase() === 'SMART-TV') {
          falsepositive = true;
        }
        if (match[1] === 'TV') {
          falsepositive = true;
        }
        if (match[1] === 'Linux') {
          falsepositive = true;
        }
        if (match[1] === 'Tizen') {
          falsepositive = true;
        }

        if (!falsepositive) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified = Constants.id.PATTERN;

          device = DeviceModels.identify('tizen', match[2]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }

      if ((match = /\s*([^;]+);\s+([^;\)]+)\)/u.exec(ua))) {
        let falsepositive = false;
        if (match[1] === 'U') {
          falsepositive = true;
        }
        if (match[2].startsWith('Tizen')) {
          falsepositive = true;
        }
        if (match[2].startsWith('AppleWebKit')) {
          falsepositive = true;
        }
        if (/^[a-z]{2}(?:-[a-z]{2})?$/.test(match[2])) {
          falsepositive = true;
        }

        if (!falsepositive) {
          this.data.device.model = match[2];
          this.data.device.identified = Constants.id.PATTERN;

          device = DeviceModels.identify('tizen', match[2]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }

      if (!this.data.device.type && /Mobile/iu.test(ua)) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (/\((SMART[ -])?TV;/iu.test(ua)) {
        this.data.device.type = Constants.deviceType.TELEVISION;
        this.data.device.manufacturer = 'Samsung';
        this.data.device.series = 'Smart TV';
        this.data.device.identified = Constants.id.PATTERN;
      }

      if ((match = /(?:Samsung|Tizen ?)Browser\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.name = 'Samsung Browser';
        this.data.browser.channel = null;
        this.data.browser.stock = true;
        this.data.browser.version = new Version({value: match[1]});
        this.data.browser.channel = null;
      }
    }

    if ((match = /Linux; U; Android [0-9.]+; ko-kr; SAMSUNG; (NX[0-9]+[^)\]]*)/u.exec(ua))) {
      this.data.os.name = 'Tizen';
      this.data.os.version = null;

      this.data.device.type = Constants.deviceType.CAMERA;
      this.data.device.manufacturer = 'Samsung';
      this.data.device.model = match[1];
      this.data.device.identified = Constants.id.PATTERN;
    }
  }

  /* Symbian */

  static detectSymbian(ua) {
    let match;
    if (!/(EPOC|Series|Symbian|S60|UIQ)/iu.test(ua)) {
      return;
    }

    /* EPOC */

    if ((match = /EPOC(?:32)?[;\-\)]/u.exec(ua))) {
      this.data.os.name = 'EPOC';
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.PDA;

      if ((match = /Crystal\/([0-9.]*)/u.exec(ua))) {
        this.data.os.name = 'Series80';
        this.data.os.version = new Version({value: '1.0'});
        this.data.os.family.version = new Version({value: match[1]});
        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = '9210';
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if (/Nokia\/Series-9200/u.test(ua)) {
        this.data.os.name = 'Series80';
        this.data.os.version = new Version({value: '1.0'});
        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = '9210i';
        this.data.device.identified |= Constants.id.PATTERN;
      }
    }

    /* Series 80 */

    if ((match = /Series80\/([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'Series80';
      this.data.os.version = new Version({value: match[1]});
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Series 60 */

    if (/Symbian\/3/u.test(ua)) {
      this.data.os.name = 'Series60';
      this.data.os.version = new Version({value: '5.2'});
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    if (/Series[ ]?60/u.test(ua) || /S60[V\/;]/u.test(ua) || /S60 Symb/u.test(ua)) {
      this.data.os.name = 'Series60';
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /Series60\/([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /S60\/([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /S60V([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* UIQ */

    if ((match = /UIQ\/([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'UIQ';
      this.data.os.version = new Version({value: match[1]});
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Symbian */

    if (/Symbian/u.test(ua)) {
      this.data.os.family = new Family({name: 'Symbian'});
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /SymbianOS\/([0-9.]*)/u.exec(ua))) {
        this.data.os.family.version = new Version({value: match[1]});
      }
    }

    if (this.data.os.isFamily('Symbian')) {
      if ((match = /Nokia-?([^\/;\)\s]+)[\s|\/|;|\)]/u.exec(ua))) {
        if (match[1] !== 'Browser') {
          this.data.device.manufacturer = 'Nokia';
          this.data.device.model = DeviceModels.cleanup(match[1]);
          this.data.device.identified |= Constants.id.PATTERN;
        }
      }

      if ((match = /Symbian(?:\/3)?; U; (?:Nokia)?([^;]+); [a-z][a-z](?:-[a-z][a-z])?/u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if ((match = /Vertu([^/;]+)[/|;]/u.exec(ua))) {
        this.data.device.manufacturer = 'Vertu';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if ((match = /Samsung\/([^;]*);/u.exec(ua))) {
        this.data.device.manufacturer = 'Samsung';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if (this.data.device.model) {
        const device = DeviceModels.identify('symbian', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
  }

  static detectNokiaOs(ua) {
    let match;
    let device;
    if (!/(Series|MeeGo|Maemo|Geos)/iu.test(ua)) {
      return;
    }

    /* Series 40 */

    if (/Series40/u.test(ua)) {
      this.data.os.name = 'Series40';

      if ((match = /Nokia([^/]+)\//u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if (this.data.device.model) {
        device = DeviceModels.identify('s40', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if (this.data.device.model) {
        device = DeviceModels.identify('asha', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.os.name = 'Nokia Asha Platform';
          this.data.os.version = new Version({value: '1.0'});
          this.data.device = device;
        }

        if ((match = /java_runtime_version=Nokia_Asha_([0-9_]+);/u.exec(ua))) {
          this.data.os.version = new Version({
            value: match[1].replace(/_/g, '.'),
          });
        }
      }

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Series 30+ */

    if (/Series30Plus/u.test(ua)) {
      this.data.os.name = 'Series30+';

      if ((match = /Nokia([^\/]+)\//u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
      }

      if (this.data.device.model) {
        device = DeviceModels.identify('s30plus', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Meego */

    if (/MeeGo/u.test(ua)) {
      this.data.os.name = 'MeeGo';
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /Nokia([^\);]+)\)/u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = DeviceModels.cleanup(match[1]);
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.generic = false;
      }
    }

    /* Maemo */

    if (/Maemo/u.test(ua)) {
      this.data.os.name = 'Maemo';
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /(N[0-9]+)/u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = match[1];
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.generic = false;
      }
    }

    /* GEOS */

    if ((match = /Geos ([0-9.]+)/u.exec(ua))) {
      this.data.os.name = 'GEOS';
      this.data.os.version = new Version({value: match[1]});
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /Nokia-([0-9]{4,4}[a-z]?)/u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = match[1];
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.generic = false;
      }
    }
  }

  /* WebOS */

  static detectWebos(ua) {
    let match;
    if ((match = /(?:web|hpw)OS\/(?:HP webOS )?([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'webOS';
      this.data.os.version = new Version({value: match[1], details: 2});
      this.data.device.type = /Tablet/iu.test(ua) ? Constants.deviceType.TABLET : Constants.deviceType.MOBILE;
      this.data.device.generic = false;
    }

    if (/(?:Spark|elite)\/fzz/u.test(ua) || /webOSBrowser/u.test(ua)) {
      this.data.os.name = 'webOS';
      this.data.device.type = /Tablet/iu.test(ua) ? Constants.deviceType.TABLET : Constants.deviceType.MOBILE;
      this.data.device.generic = false;
    }

    if ((match = / (Pre|Pixi|TouchPad|P160UN?A?)\/[0-9.]+$/u.exec(ua))) {
      this.data.os.name = 'webOS';
      this.data.device.type = match[1] === 'TouchPad' ? Constants.deviceType.TABLET : Constants.deviceType.MOBILE;
      this.data.device.generic = false;
    }

    if (this.data.isOs('webOS')) {
      if (/Pre\/1.0/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pre';
      }
      if (/Pre\/1.1/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pre Plus';
      }
      if (/Pre\/1.2/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pre 2';
      }
      if (/Pre\/3.0/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pre 3';
      }
      if (/Pixi\/1.0/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pixi';
      }
      if (/Pixi\/1.1/u.test(ua)) {
        this.data.device.manufacturer = 'Palm';
        this.data.device.model = 'Pixi Plus';
      }
      if (/P160UN?A?\/1.0/u.test(ua)) {
        this.data.device.manufacturer = 'HP';
        this.data.device.model = 'Veer';
      }
      if (/TouchPad\/1.0/u.test(ua)) {
        this.data.device.manufacturer = 'HP';
        this.data.device.model = 'TouchPad';
      }

      if (/Emulator\//u.test(ua) || /Desktop\//u.test(ua)) {
        this.data.device.type = Constants.deviceType.EMULATOR;
        this.data.device.manufacturer = null;
        this.data.device.model = null;
      }

      this.data.device.identified |= Constants.id.MATCH_UA;
    }
  }

  /* Kai OS */

  static detectKaiOS(ua) {
    let match;
    if ((match = /Kai(OS)?\/([0-9.]+)/i.exec(ua))) {
      this.data.os.reset({
        name: 'KaiOS',
        version: new Version({value: match[2]}),
      });
      this.data.os.family = new Family({name: 'Firefox OS'});
    }
  }

  /* BlackBerry */

  static detectBlackberry(ua) {
    /* BlackBerry OS */
    let match;
    let device;

    if ((match = /RIM([0-9]{3})/u.exec(ua))) {
      this.data.os.name = 'BlackBerry OS';
      this.data.device.manufacturer = 'RIM';
      this.data.device.model = match[1];
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.identified = Constants.id.INFER;
    }

    if (/BlackBerry/u.test(ua) && !/BlackBerry Runtime for Android Apps/u.test(ua)) {
      this.data.os.name = 'BlackBerry OS';

      this.data.device.model = 'BlackBerry';
      this.data.device.manufacturer = 'RIM';
      this.data.device.type = Constants.deviceType.MOBILE;
      this.data.device.identified = Constants.id.INFER;

      if (!/Opera/u.test(ua)) {
        if ((match = /BlackBerry([0-9]+[ei]?)\/([0-9.]*)/u.exec(ua))) {
          this.data.device.model = match[1];
          this.data.os.version = new Version({value: match[2], details: 2});
        }

        if ((match = /; BlackBerry ([0-9]*);/u.exec(ua))) {
          this.data.device.model = match[1];
        }

        if ((match = /; ([0-9]+)[^;\)]+\)/u.exec(ua))) {
          this.data.device.model = match[1];
        }

        if ((match = /Version\/([0-9.]*)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});
        }

        if (this.data.os.version && this.data.os.version.toFloat() >= 10) {
          this.data.os.name = 'BlackBerry';
        }

        if (this.data.device.model) {
          device = DeviceModels.identify('blackberry', this.data.device.model);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }
    }

    /* BlackBerry 10 */

    if ((match = /\(BB(1[^;]+); ([^\)]+)\)/u.exec(ua))) {
      this.data.os.name = 'BlackBerry';
      this.data.os.version = new Version({value: match[1], details: 2});

      this.data.device.manufacturer = 'BlackBerry';
      this.data.device.model = match[2];

      if (this.data.device.model === 'Kbd') {
        this.data.device.model = 'Q series or Passport';
      }

      if (this.data.device.model === 'Touch') {
        this.data.device.model = 'A or Z series';
      }

      if (this.data.device.model === 'STL100-2') {
        this.data.device.model = 'Z10';
      }

      this.data.device.type = /Mobile/u.test(ua) ? Constants.deviceType.MOBILE : Constants.deviceType.TABLET;
      this.data.device.identified |= Constants.id.MATCH_UA;

      if ((match = /Version\/([0-9.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1], details: 2});
      }
    }

    /* BlackBerry Tablet OS */

    if ((match = /RIM Tablet OS ([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'BlackBerry Tablet OS';
      this.data.os.version = new Version({value: match[1], details: 2});

      this.data.device.manufacturer = 'RIM';
      this.data.device.model = 'BlackBerry PlayBook';
      this.data.device.type = Constants.deviceType.TABLET;
      this.data.device.identified |= Constants.id.MATCH_UA;
    } else if (/\(PlayBook;/u.test(ua) && (match = /PlayBook Build\/([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'BlackBerry Tablet OS';
      this.data.os.version = new Version({value: match[1], details: 2});

      this.data.device.manufacturer = 'RIM';
      this.data.device.model = 'BlackBerry PlayBook';
      this.data.device.type = Constants.deviceType.TABLET;
      this.data.device.identified |= Constants.id.MATCH_UA;
    } else if (/PlayBook/u.test(ua) && !/Android/u.test(ua)) {
      if ((match = /Version\/([0-9.]*)/u.exec(ua))) {
        this.data.os.name = 'BlackBerry Tablet OS';
        this.data.os.version = new Version({value: match[1], details: 2});

        this.data.device.manufacturer = 'RIM';
        this.data.device.model = 'BlackBerry PlayBook';
        this.data.device.type = Constants.deviceType.TABLET;
        this.data.device.identified |= Constants.id.MATCH_UA;
      }
    }

    /* Internal versions of BlackBerry 10 running on the Playbook */

    if (this.data.isOs('BlackBerry Tablet OS', '>=', 10)) {
      this.data.os.name = 'BlackBerry';
    }
  }

  /* Chrome OS */

  static detectChromeos(ua) {
    /* ChromeCast */

    if (/CrKey/u.test(ua) && !/Espial/u.test(ua)) {
      this.data.device.manufacturer = 'Google';
      this.data.device.model = 'Chromecast';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.device.identified |= Constants.id.MATCH_UA;
      this.data.device.generic = false;
    }

    /* Chrome OS */

    if (/CrOS/u.test(ua)) {
      this.data.os.name = 'Chrome OS';
      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  /* Open TV */

  static detectOpenTV(ua) {
    let match;
    if ((match = /OpenTV/iu.exec(ua))) {
      this.data.device.type = Constants.deviceType.TELEVISION;

      this.data.os.name = 'OpenTV';
      this.data.os.version = null;

      if ((match = /OpenTV Build\/([0-9\.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /OpenTV ([0-9\.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /Opentv([0-9]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /OTV([0-9\.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }
  }

  /* Qtopia */

  static detectQtopia(ua) {
    if (/Qtopia/u.test(ua)) {
      this.data.os.name = 'Qtopia';

      let match;
      if ((match = /Qtopia\/([0-9.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }
  }

  /* Unix */

  static detectUnix(ua) {
    if (!/(UNIX|OSF|ULTRIX|HP-UX|SunOS|Solaris|AIX|IRIX|NEWS-OS|GENIX)/iu.test(ua)) {
      return;
    }
    let match;
    /* Unix */

    if (/Unix/iu.test(ua)) {
      this.data.os.name = 'Unix';
    }

    /* Unix System V */

    if ((match = /(?:UNIX_System_V|UNIX_SV) ([0-9.]*)/u.exec(ua))) {
      this.data.os.name = 'UNIX System V';
      this.data.os.family = new Family({name: 'UNIX'});
      this.data.os.version = new Version({value: match[1]});
      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* Digital Unix */

    if (/OSF1?[ _]/u.test(ua)) {
      this.data.os.name = 'Digital Unix';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /OSF1?[ _]V?([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* Digital ULTRIX */

    if (/ULTRIX/u.test(ua)) {
      this.data.os.name = 'ULTRIX';
      this.data.os.family = new Family({name: 'BSD'});

      if ((match = /ULTRIX ([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* HP-UX */

    if (/HP-UX/u.test(ua)) {
      this.data.os.name = 'HP-UX';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /HP-UX [A-Z].0?([1-9][0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* Solaris */

    if (/SunOS/u.test(ua)) {
      this.data.os.name = 'Solaris';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /SunOS ([1234]\.[0-9\.]+)/u.exec(ua))) {
        this.data.os.name = 'SunOS';
        this.data.os.version = new Version({value: match[1]});
        this.data.os.family = new Family({name: 'BSD'});

        if ((match = /SunOS 4\.1\.([1234])/u.exec(ua))) {
          this.data.os.name = 'Solaris';

          switch (match[1]) {
            case '1':
              this.data.os.version = new Version({value: '1.0'});
              break;
            case '2':
              this.data.os.version = new Version({value: '1.0.1'});
              break;
            case '3':
              this.data.os.version = new Version({value: '1.1'});
              break;
            case '4':
              this.data.os.version = new Version({value: '1.1.2'});
              break;
          }
        }
      }

      if ((match = /SunOS 5\.([123456](?:\.[0-9.]*)?) /u.exec(ua))) {
        this.data.os.version = new Version({value: `2.${match[1]}`});
      } else if ((match = /SunOS 5\.([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    if ((match = /Solaris(?: ([0-9.]+))?;/u.exec(ua))) {
      this.data.os.name = 'Solaris';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /Solaris ([0-9.]+);/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* AIX */

    if (/AIX/u.test(ua)) {
      this.data.os.name = 'AIX';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /AIX ([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* IRIX */

    if (/IRIX/u.test(ua)) {
      this.data.os.name = 'IRIX';
      this.data.os.family = new Family({name: 'UNIX'});

      if ((match = /IRIX ([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      if ((match = /IRIX;?(?:64|32) ([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* Sony NEWS OS */

    if ((match = /NEWS-OS ([0-9\.]+)/u.exec(ua))) {
      this.data.os.name = 'NEWS OS';
      this.data.os.version = new Version({value: match[1]});
      this.data.os.family = new Family({name: 'BSD'});

      if (/NEWS-OS [56]/u.test(ua)) {
        this.data.os.family = new Family({name: 'UNIX'});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* NEC EWS-UX */

    if ((match = /EWS-UNIX rev ([0-9.]+)/u.exec(ua))) {
      this.data.os.name = 'EWS-UX';
      this.data.os.version = new Version({value: match[1]});
      this.data.os.family = new Family({name: 'UNIX'});

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* National Semiconductors GENIX */

    if ((match = /GENIX ([0-9.]+)/u.exec(ua))) {
      this.data.os.name = 'GENIX';
      this.data.os.version = new Version({value: match[1]});
      this.data.os.family = new Family({name: 'BSD'});

      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  /* BSD */

  static detectBsd(ua) {
    if (!/(BSD|DragonFly)/iu.test(ua)) {
      return;
    }

    let match;

    if (/X11/u.test(ua)) {
      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    /* BSD/OS */

    if (/BSD\/386/u.test(ua)) {
      this.data.os.name = 'BSD/OS';
      this.data.os.family = new Family({name: 'BSD'});
    }

    if (/BSD\/OS/u.test(ua)) {
      this.data.os.name = 'BSD/OS';
      this.data.os.family = new Family({name: 'BSD'});

      if ((match = /BSD\/OS ([0-9.]*)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* FreeBSD */

    if (/FreeBSD/iu.test(ua)) {
      this.data.os.name = 'FreeBSD';
      this.data.os.family = new Family({name: 'BSD'});

      if ((match = /FreeBSD[ -\/]?([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* OpenBSD */

    if (/OpenBSD/iu.test(ua)) {
      this.data.os.name = 'OpenBSD';
      this.data.os.family = new Family({name: 'BSD'});

      if ((match = /OpenBSD ?([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* NetBSD */

    if (/NetBSD/iu.test(ua)) {
      this.data.os.name = 'NetBSD';
      this.data.os.family = new Family({name: 'BSD'});

      if ((match = /NetBSD ?([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* DragonFly */

    if (/DragonFly/iu.test(ua)) {
      this.data.os.name = 'DragonFly BSD';
      this.data.os.family = new Family({name: 'BSD'});
    }
  }

  /* Linux */

  static detectLinux(ua) {
    let match;
    if (/Linux/u.test(ua)) {
      this.data.os.name = 'Linux';

      if (/X11/u.test(ua)) {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Antergos Linux/u.test(ua)) {
        this.data.os.name = 'Antergos Linux';
        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Arch ?Linux/u.test(ua)) {
        this.data.os.name = 'Arch Linux';
        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Black Lab Linux/u.test(ua)) {
        this.data.os.name = 'Black Lab Linux';
        if ((match = /Black Lab Linux ([0-9\.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/CentOS/u.test(ua)) {
        this.data.os.name = 'CentOS';
        if ((match = /CentOS\/[0-9\.\-]+el([0-9_]+)/u.exec(ua))) {
          this.data.os.version = new Version({
            value: match[1].replace(/_/g, '.'),
          });
        }

        if ((match = /CentOS Linux release ([0-9\.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Debian/u.test(ua)) {
        this.data.os.name = 'Debian';
        if ((match = /Debian\/([0-9.]*)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        if ((match = /Debian GNU\/Linux ([0-9\.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Fedora/u.test(ua)) {
        this.data.os.name = 'Fedora';
        if ((match = /Fedora\/[0-9.\-]+fc([0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({
            value: match[1].replace(/_/g, '.'),
          });
        }

        if ((match = /Fedora release ([0-9.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Gentoo/u.test(ua)) {
        this.data.os.name = 'Gentoo';
        if ((match = /Gentoo Base System release ([0-9.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/gNewSense/u.test(ua)) {
        this.data.os.name = 'gNewSense';
        if ((match = /gNewSense\/[^(]+\(([0-9.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Kubuntu/u.test(ua)) {
        this.data.os.name = 'Kubuntu';
        if ((match = /Kubuntu[ \/]([0-9.]*)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Linux Mint/u.test(ua)) {
        this.data.os.name = 'Linux Mint';
        if ((match = /Linux Mint ([0-9.]+)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Mandriva Linux/u.test(ua)) {
        this.data.os.name = 'Mandriva';
        if ((match = /Mandriva Linux\/[0-9.\-]+mdv([0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Mageia/u.test(ua)) {
        this.data.os.name = 'Mageia';
        if ((match = /Mageia\/[0-9\.\-]+mga([0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        if ((match = /Mageia ([0-9\.]+)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Mandriva/u.test(ua)) {
        this.data.os.name = 'Mandriva';
        if ((match = /Mandriva\/[0-9\.\-]+mdv([0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/moonOS/u.test(ua)) {
        this.data.os.name = 'moonOS';
        if ((match = /moonOS\/([0-9.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Red Hat/u.test(ua)) {
        this.data.os.name = 'Red Hat';
        if ((match = /Red Hat[^\/]*\/[0-9\.\-]+el([0-9_]+)/u.exec(ua))) {
          this.data.os.version = new Version({
            value: match[1].replace(/_/g, '.'),
          });
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Slackware/u.test(ua)) {
        this.data.os.name = 'Slackware';
        if ((match = /Slackware[ \/](1[0-9.]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/SUSE/u.test(ua)) {
        this.data.os.name = 'SUSE';
        if ((match = /SUSE\/([0-9]\.[0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        if ((match = /openSUSE ([0-9\.]+)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Turbolinux/u.test(ua)) {
        this.data.os.name = 'Turbolinux';
        if ((match = /Turbolinux\/([0-9]\.[0-9]+)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Ubuntu/u.test(ua)) {
        this.data.os.name = 'Ubuntu';
        if ((match = /Ubuntu\/([0-9.]*)/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        if ((match = /Ubuntu ([0-9\.]+)/iu.exec(ua))) {
          this.data.os.version = new Version({value: match[1], details: 2});
        }

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if ((match = /《붉은별》\/([0-9.]*)/iu.exec(ua))) {
        this.data.os.name = 'Red Star';
        this.data.os.version = new Version({value: match[1]});
        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if ((match = /Fedora\/[0-9\.\-]+rs([0-9\.]+)/u.exec(ua))) {
        this.data.os.name = 'Red Star';
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
        });

        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (/Linux\/X2\/R1/u.test(ua)) {
        this.data.os.name = 'LiMo';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if ((match = /Linux\/SLP\/([0-9.]+)/u.exec(ua))) {
        this.data.os.name = 'Linux SLP';
        this.data.os.version = new Version({value: match[1]});
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (/LinuxOS\//u.test(ua) && /Software\/R5/u.test(ua)) {
        this.data.os.name = 'EZX Linux';
        this.data.device.type = Constants.deviceType.MOBILE;
      }
    }

    if (/elementary OS/u.test(ua)) {
      this.data.os.name = 'elementary OS';
      if ((match = /elementary OS ([A-Za-z]+)/u.exec(ua))) {
        this.data.os.version = new Version({alias: match[1]});
      }

      this.data.device.type = Constants.deviceType.DESKTOP;
    }

    if (/\(Ubuntu; (Mobile|Tablet)/u.test(ua)) {
      this.data.os.name = 'Ubuntu Touch';

      if (/\(Ubuntu; Mobile/u.test(ua)) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }
      if (/\(Ubuntu; Tablet/u.test(ua)) {
        this.data.device.type = Constants.deviceType.TABLET;
      }
    }

    if ((match = /(?:\(|; )Ubuntu ([0-9.]+) like Android/u.exec(ua))) {
      this.data.os.name = 'Ubuntu Touch';
      this.data.os.version = new Version({value: match[1]});
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    if ((match = /Lindows ([0-9.]+)/u.exec(ua))) {
      this.data.os.name = 'Lindows';
      this.data.os.version = new Version({value: match[1]});
      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  /* Brew */

  static detectBrew(ua) {
    let match;
    let device;
    if (/REX; U/iu.test(ua) || /REXL4/iu.test(ua)) {
      this.data.os.name = 'REX';

      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /REX; U; [^;]+; ([^;]+); ([^;\/]+)[^;]*; NetFront/u.exec(ua))) {
        this.data.device.manufacturer = Manufacturers.identify(Constants.deviceType.MOBILE, match[1]);
        this.data.device.model = match[2];
        this.data.device.identified = Constants.id.PATTERN;

        device = DeviceModels.identify('brew', match[2]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    if (/[(\s\-;]BREW[\s\/\-;]/iu.test(ua) || /BMP( [0-9.]*)?; U/u.test(ua) || /B(?:rew)?MP\/([0-9.]*)/u.test(ua)) {
      this.data.os.name = 'Brew';

      if (/BREW MP/iu.test(ua) || /B(rew)?MP/iu.test(ua)) {
        this.data.os.name = 'Brew MP';
      }

      if ((match = /; Brew ([0-9.]+);/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      } else if ((match = /BREW; U; ([0-9.]+)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      } else if ((match = /[\(;]BREW[\/ ]([0-9.]+)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      } else if ((match = /BREW MP ([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      } else if ((match = /BMP ([0-9.]*); U/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      } else if ((match = /B(?:rew)?MP\/([0-9.]*)/iu.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }

      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /(?:Brew MP|BREW|BMP) [^;]+; U; [^;]+; ([^;]+); NetFront[^\)]+\) [^\s]+ ([^\s]+)/u.exec(ua))) {
        this.data.device.manufacturer = Manufacturers.identify(Constants.deviceType.MOBILE, match[1]);
        this.data.device.model = match[2];
        this.data.device.identified = Constants.id.PATTERN;

        device = DeviceModels.identify('brew', match[2]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if ((match = /\(([^;]+);U;REX\/[^;]+;BREW\/[^;]+;(?:.*;)?[0-9]+\*[0-9]+(?:;CTC\/2.0)?\)/u.exec(ua))) {
        this.data.device.model = match[1];
        this.data.device.identified = Constants.id.PATTERN;

        device = DeviceModels.identify('brew', match[1]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if (
        (match = /\(BREW [^;]+; U; [^;]+; [^;]+; ([^;]+); (Polaris|Netfront)\/[0-9\.]+\/(WAP|AMB|INT)\)/iu.exec(ua))
      ) {
        this.data.device.model = match[1];
        this.data.device.identified = Constants.id.PATTERN;

        device = DeviceModels.identify('brew', match[1]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if (
        (match = /\(BREW [^;]+; U; [^;]+; [^;]+; Opera Mobi; Presto\/[0-9\.]+\/(?:WAP|AMB|INT)\) ([^\/]+) [^\/]+\//iu.exec(
          ua
        ))
      ) {
        this.data.device.model = match[1];
        this.data.device.identified = Constants.id.PATTERN;

        device = DeviceModels.identify('brew', match[1]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }
  }

  /* Remaining operating systems */

  static detectRemainingOperatingSystems(ua) {
    if (
      !/(BeOS|Haiku|AmigaOS|MorphOS|AROS|VMS|RISC|Joli|OS\/2|Inferno|Syllable|Grid|MTK|MRE|MAUI|Nucleus|QNX|VRE|SpreadTrum|ThreadX)/iu.test(
        ua
      )
    ) {
      return;
    }

    const patterns = [
      {name: 'BeOS', regexp: [/BeOS/iu], type: Constants.deviceType.DESKTOP},
      {
        name: 'Haiku',
        regexp: [/Haiku/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'AmigaOS',
        regexp: [/AmigaOS ?([0-9.]+)/iu, /AmigaOS/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'MorphOS',
        regexp: [/MorphOS(?: ([0-9.]*))?/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {name: 'AROS', regexp: [/AROS/iu], type: Constants.deviceType.DESKTOP},
      {
        name: 'OpenVMS',
        regexp: [/OpenVMS V([0-9.]+)/iu, /OpenVMS/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'RISC OS',
        regexp: [/RISC OS(?:-NC)? ([0-9.]*)/iu, /RISC OS/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'Joli OS',
        regexp: [/Joli OS\/([0-9.]*)/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'OS/2',
        regexp: [/OS\/2;(?: (?:U; )?Warp ([0-9.]*))?/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'Inferno',
        regexp: [/Inferno/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'Syllable',
        regexp: [/Syllable/iu],
        type: Constants.deviceType.DESKTOP,
      },
      {
        name: 'Grid OS',
        regexp: [/Grid OS ([0-9.]*)/iu],
        type: Constants.deviceType.TABLET,
      },
      {
        name: 'MRE',
        regexp: [/\(MTK;/iu, /\/MTK /iu],
        type: Constants.deviceType.MOBILE,
      },
      {name: 'MRE', regexp: [/MRE\\\\/iu], type: Constants.deviceType.MOBILE},
      {
        name: 'MRE',
        regexp: [/MAUI[-_ ](?:Browser|Runtime)/iu],
        type: Constants.deviceType.MOBILE,
      },
      {
        name: 'MRE',
        regexp: [/Browser\/MAUI/iu],
        type: Constants.deviceType.MOBILE,
      },
      {
        name: 'MRE',
        regexp: [/Nucleus RTOS\//iu],
        type: Constants.deviceType.MOBILE,
      },
      {
        name: 'MRE',
        regexp: [/\/Nucleus/iu],
        type: Constants.deviceType.MOBILE,
      },
      {
        name: 'MRE',
        regexp: [/Nucleus\//iu],
        type: Constants.deviceType.MOBILE,
      },
      {name: 'QNX', regexp: [/QNX/iu], type: Constants.deviceType.MOBILE},
      {name: 'VRE', regexp: [/\(VRE;/iu], type: Constants.deviceType.MOBILE},
      {
        name: 'SpreadTrum',
        regexp: [/\(SpreadTrum;/iu],
        type: Constants.deviceType.MOBILE,
      },
      {name: 'ThreadX', regexp: [/ThreadX(?:_OS)?\/([0-9.]*)/iu]},
    ];

    const count = patterns.length;
    for (let b = 0; b < count; b++) {
      for (let r = 0; r < patterns[b]['regexp'].length; r++) {
        let match;
        if ((match = patterns[b]['regexp'][r].exec(ua))) {
          this.data.os.name = patterns[b]['name'];

          if (match[1]) {
            this.data.os.version = new Version({
              value: match[1],
              details: patterns[b]['details'] ? patterns[b]['details'] : null,
            });
          } else {
            this.data.os.version = null;
          }

          if (typeof patterns[b]['type'] !== 'undefined') {
            this.data.device.type = patterns[b]['type'];
          }

          break;
        }
      }
    }
  }
}

module.exports = Os;
