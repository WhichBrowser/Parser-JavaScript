/* eslint-disable require-jsdoc */

const Using = require('../../../model/Using');
const Version = require('../../../model/Version');
const Family = require('../../../model/Family');
const Constants = require('../../../constants');
const Chrome = require('../../../data/Chrome');
const DeviceModels = require('../../../data/DeviceModels');
const Applications = require('../../../data/Applications');

class Browser {
  static detectBrowser(ua) {
    /* Detect major browsers */
    Browser.detectSafari.call(this, ua);
    Browser.detectExplorer.call(this, ua);
    Browser.detectFirefox.call(this, ua);
    Browser.detectChrome.call(this, ua);
    Browser.detectEdge.call(this, ua);
    Browser.detectOpera.call(this, ua);

    /* Detect WAP browsers */
    Browser.detectWapBrowsers.call(this, ua);

    /* Detect other various mobile browsers */
    Browser.detectNokiaBrowser.call(this, ua);
    Browser.detectSilk.call(this, ua);
    Browser.detectSailfishBrowser.call(this, ua);
    Browser.detectWebOSBrowser.call(this, ua);
    Browser.detectDolfin.call(this, ua);
    Browser.detectIris.call(this, ua);

    /* Detect other browsers */
    Browser.detectUC.call(this, ua);
    Browser.detectObigo.call(this, ua);
    Browser.detectNetfront.call(this, ua);

    /* Detect other specific desktop browsers */
    Browser.detectSeamonkey.call(this, ua);
    Browser.detectModernNetscape.call(this, ua);
    Browser.detectMosaic.call(this, ua);
    Browser.detectKonqueror.call(this, ua);
    Browser.detectOmniWeb.call(this, ua);

    /* Detect other various television browsers */
    Browser.detectEspial.call(this, ua);
    Browser.detectMachBlue.call(this, ua);
    Browser.detectAnt.call(this, ua);
    Browser.detectSraf.call(this, ua);

    /* Detect other browsers */
    Browser.detectDesktopBrowsers.call(this, ua);
    Browser.detectMobileBrowsers.call(this, ua);
    Browser.detectTelevisionBrowsers.call(this, ua);
    Browser.detectRemainingBrowsers.call(this, ua);

    return this;
  }

  static refineBrowser(ua) {
    Browser.detectUCEngine.call(this, ua);
    Browser.detectLegacyNetscape.call(this, ua);

    return this;
  }

  /* Safari */

  static detectSafari(ua) {
    if (/Safari/u.test(ua)) {
      let falsepositive = false;
      let match;

      if (/Qt/u.test(ua)) {
        falsepositive = true;
      }

      if (!falsepositive) {
        if (this.data.os.name && this.data.os.name === 'iOS') {
          this.data.browser.name = 'Safari';
          this.data.browser.type = Constants.browserType.BROWSER;
          this.data.browser.version = null;
          this.data.browser.stock = true;

          if ((match = /Version\/([0-9.]+)/u.exec(ua))) {
            this.data.browser.version = new Version({
              value: match[1],
              hidden: true,
            });
          }
        }

        if (this.data.os.name && (this.data.os.name === 'OS X' || this.data.os.name === 'Windows')) {
          this.data.browser.name = 'Safari';
          this.data.browser.type = Constants.browserType.BROWSER;
          this.data.browser.stock = this.data.os.name === 'OS X';

          if ((match = /Version\/([0-9.]+)/u.exec(ua))) {
            this.data.browser.version = new Version({value: match[1]});
          }

          if (/AppleWebKit\/[0-9.]+\+/u.test(ua)) {
            this.data.browser.name = 'WebKit Nightly Build';
            this.data.browser.version = null;
          }
        }
      }
    }

    if (/(?:Apple-PubSub|AppleSyndication)\//u.test(ua)) {
      this.data.browser.name = 'Safari RSS';
      this.data.browser.type = Constants.browserType.APP_FEEDREADER;
      this.data.browser.version = null;
      this.data.browser.stock = true;

      this.data.os.name = 'OS X';
      this.data.os.version = null;

      this.data.device.type = Constants.deviceType.DESKTOP;
    }
  }

  /* Chrome */

  static detectChrome(ua) {
    let match;
    if (/(?:Chrome|CrMo|CriOS)\/[0-9]/u.test(ua) || /Browser\/Chrome[0-9]/u.test(ua)) {
      this.data.browser.name = 'Chrome';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;

      let version = '';
      if ((match = /(?:Chrome|CrMo|CriOS)\/([0-9.]*)/u.exec(ua))) {
        version = match[1];
      }
      if ((match = /Browser\/Chrome([0-9.]*)/u.exec(ua))) {
        version = match[1];
      }
      this.data.browser.version = new Version({value: version});

      if (this.data.os.name && this.data.os.name === 'Android') {
        const channel = Chrome.getChannel('mobile', this.data.browser.version.value);

        if (channel === 'stable') {
          this.data.browser.version.details = 1;
        } else if (channel === 'beta') {
          this.data.browser.channel = 'Beta';
        } else {
          this.data.browser.channel = 'Dev';
        }

        /* Webview for Android 4.4 and higher */

        if (
          version
            .split('.')
            .slice(1, 3)
            .join('.') === '0.0' &&
          (/Version\//u.test(ua) || /Release\//u.test(ua))
        ) {
          this.data.browser.using = new Using({
            name: 'Chromium WebView',
            version: new Version({value: version.split('.')[0]}),
          });
          this.data.browser.type = Constants.browserType.UNKNOWN;
          this.data.browser.stock = true;
          this.data.browser.name = null;
          this.data.browser.version = null;
          this.data.browser.channel = null;
        }

        /* Webview for Android 5 */
        if (/; wv\)/u.test(ua)) {
          this.data.browser.using = new Using({
            name: 'Chromium WebView',
            version: new Version({value: version.split('.')[0]}),
          });
          this.data.browser.type = Constants.browserType.UNKNOWN;
          this.data.browser.stock = true;
          this.data.browser.name = null;
          this.data.browser.version = null;
          this.data.browser.channel = null;
        }

        /* LG Chromium based browsers */
        if (this.data.device.manufacturer && this.data.device.manufacturer === 'LG') {
          if (
            ['30.0.1599.103', '34.0.1847.118', '38.0.2125.0', '38.0.2125.102'].includes(version) &&
            /Version\/4/u.test(ua) &&
            !/; wv\)/u.test(ua)
          ) {
            this.data.browser.name = 'LG Browser';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = null;
          }
        }

        /* Samsung Chromium based browsers */
        if (this.data.device.manufacturer && this.data.device.manufacturer === 'Samsung') {
          /* Version 1.0 */
          if (version === '18.0.1025.308' && /Version\/1.0/u.test(ua)) {
            this.data.browser.name = 'Samsung Internet';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = new Version({value: '1.0'});
          }

          /* Version 1.5 */
          if (version === '28.0.1500.94' && /Version\/1.5/u.test(ua)) {
            this.data.browser.name = 'Samsung Internet';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = new Version({value: '1.5'});
          }

          /* Version 1.6 */
          if (version === '28.0.1500.94' && /Version\/1.6/u.test(ua)) {
            this.data.browser.name = 'Samsung Internet';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = new Version({value: '1.6'});
          }

          /* Version 2.0 */
          if (version === '34.0.1847.76' && /Version\/2.0/u.test(ua)) {
            this.data.browser.name = 'Samsung Internet';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = new Version({value: '2.0'});
          }

          /* Version 2.1 */
          if (version === '34.0.1847.76' && /Version\/2.1/u.test(ua)) {
            this.data.browser.name = 'Samsung Internet';
            this.data.browser.channel = null;
            this.data.browser.stock = true;
            this.data.browser.version = new Version({value: '2.1'});
          }
        }

        /* Samsung Chromium based browsers */
        if ((match = /SamsungBrowser\/([0-9.]*)/u.exec(ua))) {
          this.data.browser.name = 'Samsung Internet';
          this.data.browser.channel = null;
          this.data.browser.stock = true;
          this.data.browser.version = new Version({value: match[1]});

          if (/Mobile VR/.test(ua)) {
            this.data.device.manufacturer = 'Samsung';
            this.data.device.model = 'Gear VR';
            this.data.device.type = Constants.deviceType.HEADSET;
          }
        }

        /* Oculus Chromium based browsers */
        if ((match = /OculusBrowser\/([0-9.]*)/u.exec(ua))) {
          this.data.browser.name = 'Oculus Browser';
          this.data.browser.channel = null;
          this.data.browser.stock = true;
          this.data.browser.version = new Version({
            value: match[1],
            details: 2,
          });

          if (/Mobile VR/.test(ua)) {
            this.data.device.manufacturer = 'Samsung';
            this.data.device.model = 'Gear VR';
            this.data.device.type = Constants.deviceType.HEADSET;
          }

          if (/Pacific/.test(ua)) {
            this.data.device.manufacturer = 'Oculus';
            this.data.device.model = 'Go';
            this.data.device.type = Constants.deviceType.HEADSET;
          }
        }
      } else if (
        this.data.os.name &&
        this.data.os.name === 'Linux' &&
        (match = /SamsungBrowser\/([0-9.]*)/u.exec(ua))
      ) {
        this.data.browser.name = 'Samsung Internet';
        this.data.browser.channel = null;
        this.data.browser.stock = true;
        this.data.browser.version = new Version({value: match[1]});

        this.data.os.name = 'Android';
        this.data.os.version = null;

        this.data.device.manufacturer = 'Samsung';
        this.data.device.model = 'DeX';
        this.data.device.identifier = '';
        this.data.device.identified |= Constants.id.PATTERN;
        this.data.device.type = Constants.deviceType.DESKTOP;
      } else {
        const channel = Chrome.getChannel('desktop', version);

        if (channel === 'stable') {
          if (version.split('.')[1] === '0') {
            this.data.browser.version.details = 1;
          } else {
            this.data.browser.version.details = 2;
          }
        } else if (channel === 'beta') {
          this.data.browser.channel = 'Beta';
        } else {
          this.data.browser.channel = 'Dev';
        }
      }

      if (this.data.device.type === '') {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }
    }

    /* Google Chromium */

    if (/Chromium/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.channel = '';
      this.data.browser.name = 'Chromium';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Chromium\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if (this.data.device.type === '') {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }
    }

    /* Chrome Content Shell */

    if (/Chrome\/[0-9]+\.77\.34\.5/u.test(ua)) {
      this.data.browser.using = new Using({name: 'Chrome Content Shell'});

      this.data.browser.type = Constants.browserType.UNKNOWN;
      this.data.browser.stock = false;
      this.data.browser.name = null;
      this.data.browser.version = null;
      this.data.browser.channel = null;
    }

    /* Chromium WebView by Amazon */

    if (/AmazonWebAppPlatform\//u.test(ua)) {
      this.data.browser.using = new Using({name: 'Amazon WebView'});

      this.data.browser.type = Constants.browserType.UNKNOWN;
      this.data.browser.stock = false;
      this.data.browser.name = null;
      this.data.browser.version = null;
      this.data.browser.channel = null;
    }

    /* Chromium WebView by Crosswalk */

    if ((match = /Crosswalk\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.using = new Using({
        name: 'Crosswalk WebView',
        version: new Version({value: match[1], details: 1}),
      });

      this.data.browser.type = Constants.browserType.UNKNOWN;
      this.data.browser.stock = false;
      this.data.browser.name = null;
      this.data.browser.version = null;
      this.data.browser.channel = null;
    }

    /* Set the browser family */

    if (this.data.isBrowser('Chrome') || this.data.isBrowser('Chromium')) {
      this.data.browser.family = new Family({
        name: 'Chrome',
        version: this.data.browser.version ? new Version({value: this.data.browser.version.getMajor()}) : null,
      });
    }
  }

  /* Internet Explorer */

  static detectExplorer(ua) {
    let match;
    if ((match = /\(IE ([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Internet Explorer';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Browser\/IE([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Internet Explorer';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if (/MSIE/u.test(ua)) {
      this.data.browser.name = 'Internet Explorer';
      this.data.browser.type = Constants.browserType.BROWSER;

      if (
        /IEMobile/u.test(ua) ||
        /Windows CE/u.test(ua) ||
        /Windows Phone/u.test(ua) ||
        /WP7/u.test(ua) ||
        /WPDesktop/u.test(ua)
      ) {
        this.data.browser.name = 'Mobile Internet Explorer';

        if (
          this.data.device.model &&
          (this.data.device.model === 'Xbox 360' || this.data.device.model === 'Xbox One')
        ) {
          this.data.browser.name = 'Internet Explorer';
        }
      }

      if ((match = /MSIE ([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1].replace(/\.([0-9])([0-9])/, '.$1.$2'),
        });
      }

      if (/Mac_/u.test(ua)) {
        this.data.os.name = 'Mac OS';
        this.data.engine.name = 'Tasman';
        this.data.device.type = Constants.deviceType.DESKTOP;

        if (typeof this.data.browser.version !== 'undefined') {
          if (this.data.browser.version.is('>=', '5.1.1') && this.data.browser.version.is('<=', '5.1.3')) {
            this.data.os.name = 'OS X';
          }

          if (this.data.browser.version.is('>=', '5.2')) {
            this.data.os.name = 'OS X';
          }
        }
      }
    }

    if ((match = /Trident\/[789][^)]+; rv:([0-9.]*)\)/u.exec(ua))) {
      this.data.browser.name = 'Internet Explorer';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Trident\/[789][^)]+; Touch; rv:([0-9.]*);\s+IEMobile\//u.exec(ua))) {
      this.data.browser.name = 'Mobile Internet Explorer';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Trident\/[789][^)]+; Touch; rv:([0-9.]*); WPDesktop/u.exec(ua))) {
      this.data.browser.mode = 'desktop';
      this.data.browser.name = 'Mobile Internet Explorer';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    /* Old versions of Pocket Internet Explorer */

    if (this.data.isBrowser('Mobile Internet Explorer', '<', 6)) {
      this.data.browser.name = 'Pocket Internet Explorer';
    }

    if (/Microsoft Pocket Internet Explorer\//u.test(ua)) {
      this.data.browser.name = 'Pocket Internet Explorer';
      this.data.browser.version = new Version({value: '1.0'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    if ((match = /MSPIE ([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Pocket Internet Explorer2';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Microsoft Mobile Explorer */

    if ((match = /MMEF([0-9])([0-9])/u.exec(ua))) {
      this.data.browser.name = 'Microsoft Mobile Explorer';
      this.data.browser.version = new Version({
        value: `${match[1]}.${match[2]}`,
      });
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.MOBILE;

      if ((match = /MMEF[0-9]+; ([^;]+); ([^)/]+)/u.exec(ua))) {
        const device = DeviceModels.identify(
          'feature',
          match[1] === 'CellPhone' ? match[2] : `${match[1]} ${match[2]}`
        );
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    /* Set the browser family */

    if (
      this.data.isBrowser('Internet Explorer') ||
      this.data.isBrowser('Mobile Internet Explorer') ||
      this.data.isBrowser('Pocket Internet Explorer')
    ) {
      this.data.browser.family = null;
    }
  }

  /* Edge */

  static detectEdge(ua) {
    let match;
    if ((match = /Edge\/([0-9]+)/u.exec(ua))) {
      this.data.browser.name = 'Edge';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: match[1], details: 1});

      this.data.browser.family = null;
    }

    if ((match = /Edg(iOS|A)\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Edge';
      this.data.browser.version = new Version({
        value: match[2],
        details: 1,
        hidden: true,
      });
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Edg\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Edge';
      this.data.browser.channel = '';
      this.data.browser.version = new Version({
        value: match[1],
        details: 1,
      });
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* Opera */

  static detectOpera(ua) {
    if (!/(OPR|OMI|Opera|OPiOS|Coast|Oupeng)/iu.test(ua)) {
      return;
    }
    let match;
    if ((match = /OPR\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.channel = '';
      this.data.browser.name = 'Opera';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (/Edition Developer/iu.test(ua)) {
        this.data.browser.channel = 'Developer';
      }

      if (/Edition Next/iu.test(ua)) {
        this.data.browser.channel = 'Next';
      }

      if (/Edition Beta/iu.test(ua)) {
        this.data.browser.channel = 'Beta';
      }

      if (this.data.device.type === Constants.deviceType.MOBILE) {
        this.data.browser.name = 'Opera Mobile';
      }
    }

    if ((match = /OMI\/([0-9]+\.[0-9]+)/u.exec(ua))) {
      this.data.browser.name = 'Opera Devices';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.TELEVISION;

      if (!this.data.isOs('Android')) {
        this.data.os.name = null;
        this.data.os.version = null;
      }
    }

    if ((/Opera[/\-\s]/iu.test(ua) || /Browser\/Opera/iu.test(ua)) && !/Opera Software/iu.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Opera';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Opera[/| ]?([0-9.]+)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if ((match = /Version\/([0-9.]+)/u.exec(ua))) {
        if (parseFloat(match[1]) >= 10) {
          this.data.browser.version = new Version({value: match[1]});
        }
      }

      if (this.data.browser.version && /Edition Labs/u.test(ua)) {
        this.data.browser.channel = 'Labs';
      }

      if (this.data.browser.version && /Edition Next/u.test(ua)) {
        this.data.browser.channel = 'Next';
      }

      if (/Opera Tablet/u.test(ua)) {
        this.data.browser.name = 'Opera Mobile';
        this.data.device.type = Constants.deviceType.TABLET;
      }

      if (/Opera Mobi/u.test(ua)) {
        this.data.browser.name = 'Opera Mobile';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (/Opera Mini;/u.test(ua)) {
        this.data.browser.name = 'Opera Mini';
        this.data.browser.version = null;
        this.data.browser.mode = 'proxy';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if ((match = /Opera Mini\/(?:att\/)?([0-9.]+)/u.exec(ua))) {
        this.data.browser.name = 'Opera Mini';
        this.data.browser.version = new Version({
          value: match[1],
          details: parseInt(match[1].substr(match[1].lastIndexOf('.')).substr(1), 10) > 99 ? -1 : null,
        });
        this.data.browser.mode = 'proxy';
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (this.data.browser.name === 'Opera' && this.data.device.type === Constants.deviceType.MOBILE) {
        this.data.browser.name = 'Opera Mobile';
      }

      if (/InettvBrowser/u.test(ua)) {
        this.data.device.type = Constants.deviceType.TELEVISION;
      }

      if (/Opera[ -]TV/u.test(ua)) {
        this.data.browser.name = 'Opera';
        this.data.device.type = Constants.deviceType.TELEVISION;
      }

      if (/Linux zbov/u.test(ua)) {
        this.data.browser.name = 'Opera Mobile';
        this.data.browser.mode = 'desktop';

        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.os.name = null;
        this.data.os.version = null;
      }

      if (/Linux zvav/u.test(ua)) {
        this.data.browser.name = 'Opera Mini';
        this.data.browser.version = null;
        this.data.browser.mode = 'desktop';

        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.os.name = null;
        this.data.os.version = null;
      }

      if (this.data.device.type === '') {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }

      if (this.data.browser.family) {
        this.data.browser.family = null;
      }
    }

    if ((match = /OPiOS\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Opera Mini';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Coast\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Coast by Opera';
      this.data.browser.version = new Version({value: match[1], details: 3});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /Oupeng(?:HD)?[/-]([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Opera Oupeng';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* Firefox */

  static detectFirefox(ua) {
    let match;
    if (
      !/(Firefox|GranParadiso|Namoroka|Shiretoko|Minefield|BonEcho|Fennec|Phoenix|Firebird|Minimo|FxiOS)/iu.test(ua)
    ) {
      return;
    }

    if (/Firefox/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Firefox';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Firefox\/([0-9ab.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});

        if (/a/u.test(match[1])) {
          this.data.browser.channel = 'Aurora';
        }

        if (/b/u.test(match[1])) {
          this.data.browser.channel = 'Beta';
        }
      }

      if ((match = /Aurora\/([0-9ab.]*)/u.exec(ua))) {
        this.data.browser.channel = 'Aurora';
        this.data.browser.version = new Version({value: match[1]});
      }

      if (/Fennec/u.test(ua)) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if ((match = /Mobile;(?: ([^;]+);)? rv/u.exec(ua))) {
        this.data.device.type = Constants.deviceType.MOBILE;

        if (match[1]) {
          const device = DeviceModels.identify('firefoxos', match[1]);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
            if (!this.data.isOs('KaiOS')) {
              this.data.os.reset({name: 'Firefox OS'});
            }
          }
        }
      }

      if (/Tablet;(?: ([^;]+);)? rv/u.test(ua)) {
        this.data.device.type = Constants.deviceType.TABLET;
      }

      if (/Viera;(?: ([^;]+);)? rv/u.test(ua)) {
        this.data.device.type = Constants.deviceType.TELEVISION;
        this.data.os.reset({name: 'Firefox OS'});
      }

      if (
        this.data.device.type === Constants.deviceType.MOBILE ||
        this.data.device.type === Constants.deviceType.TABLET
      ) {
        this.data.browser.name = 'Firefox Mobile';
      }

      if (this.data.device.type === '') {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }
    }

    if ((match = /(GranParadiso|Namoroka|Shiretoko|Minefield|BonEcho)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Firefox';
      this.data.browser.channel = match[1].replace('GranParadiso', 'Gran Paradiso');
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = new RegExp(`${match[1]}/([0-9ab.]*)`, 'u').exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    if (/Fennec/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Firefox Mobile';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Fennec\/([0-9ab.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      this.data.browser.channel = 'Fennec';
    }

    if ((match = /(Phoenix|Firebird|Minimo)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = match[1];
      this.data.browser.type = Constants.browserType.BROWSER;
      if ((match = new RegExp(`${match[1]}/([0-9ab.]*)`, 'u').exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    if ((match = /FxiOS\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Firefox';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if (/Servo\/1.0 Firefox\//u.test(ua)) {
      this.data.browser.name = 'Servo Nightly Build';
      this.data.browser.version = null;
    }

    /* Set the browser family */

    if (this.data.isBrowser('Firefox') || this.data.isBrowser('Firefox Mobile') || this.data.isBrowser('Firebird')) {
      this.data.browser.family = new Family({
        name: 'Firefox',
        version: this.data.browser.version,
      });
    }

    if (this.data.isBrowser('Minimo')) {
      this.data.browser.family = new Family({name: 'Firefox'});
    }
  }

  /* Seamonkey */

  static detectSeamonkey(ua) {
    let match;
    if (/SeaMonkey/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'SeaMonkey';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /SeaMonkey\/([0-9ab.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    if ((match = /PmWFx\/([0-9ab.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'SeaMonkey';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* Netscape */

  static detectLegacyNetscape(ua) {
    let match;
    if (this.data.device.type === Constants.deviceType.DESKTOP && this.data.browser.getName() === '') {
      if (!/compatible;/u.test(ua)) {
        if ((match = /Mozilla\/([123].[0-9]+)/u.exec(ua))) {
          this.data.browser.name = 'Netscape Navigator';
          this.data.browser.version = new Version({
            value: match[1].replace(/([0-9])([0-9])/, '$1.$2'),
          });
          this.data.browser.type = Constants.browserType.BROWSER;
        }

        if ((match = /Mozilla\/(4.[0-9]+)/u.exec(ua))) {
          this.data.browser.name = 'Netscape Communicator';
          this.data.browser.version = new Version({
            value: match[1].replace(/([0-9])([0-9])/, '$1.$2'),
          });
          this.data.browser.type = Constants.browserType.BROWSER;

          if (/Nav\)/u.test(ua)) {
            this.data.browser.name = 'Netscape Navigator';
          }
        }
      }
    }
  }

  static detectModernNetscape(ua) {
    let match;
    if (/Netscape/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Netscape';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Netscape[0-9]?\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    if ((match = / Navigator\/(9\.[0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'Netscape Navigator';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.version = new Version({value: match[1], details: 3});
    }
  }

  /* Mosaic */

  static detectMosaic(ua) {
    let match;
    if (!/Mosaic/iu.test(ua)) {
      return;
    }

    if (
      (match = /(?:NCSA[ _])?Mosaic(?:\(tm\))?(?: for the X Window System| for Windows)?\/(?:Version )?([0-9.]*)/u.exec(
        ua
      ))
    ) {
      this.data.browser.name = 'NCSA Mosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /AIR_Mosaic(?:\(16bit\))?\/v([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'AIR Mosaic';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /(?:MosaicView|Spyglass[ _]Mosaic)\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Spyglass Mosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /SPRY_Mosaic(?:\(16bit\))?\/v([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'SPRY Mosaic';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /DCL SuperMosaic\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'SuperMosaic';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /VMS_Mosaic\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'VMS Mosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /mMosaic\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'mMosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /Quarterdeck Mosaic Version ([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Quarterdeck Mosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /WinMosaic\/Version ([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'WinMosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;
    }

    if ((match = /Device Mosaic ([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Device Mosaic';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = new Family({name: 'Mosaic'});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.stock = false;

      this.data.device.type = Constants.deviceType.TELEVISION;
    }
  }

  /* UC Browser */
  static detectUC(ua) {
    let match;
    if (!/(UC|UBrowser)/iu.test(ua)) {
      return;
    }

    if (/UCWEB/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.channel = null;

      if ((match = /UCWEB\/?([0-9]*[.][0-9]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }

      if (!this.data.device.type) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (this.data.os.name && this.data.os.name === 'Linux') {
        this.data.os.reset();
      }

      if ((match = /^IUC ?\(U; ?iOS ([0-9._]+);/u.exec(ua))) {
        this.data.os.name = 'iOS';
        this.data.os.version = new Version({
          value: match[1].replace(/_/g, '.'),
        });
      }

      if (
        (match = /^JUC ?\(Linux; ?U; ?(?:Android)? ?([0-9.]+)[^;]*; ?[^;]+; ?([^;]*[^\s])\s*; ?[0-9]+\*[0-9]+;?\)/u.exec(
          ua
        ))
      ) {
        this.data.os.name = 'Android';
        this.data.os.version = new Version({value: match[1]});

        this.data.device = DeviceModels.identify('android', match[2]);
      }

      if ((match = /\(MIDP-2.0; U; [^;]+; ([^;]*[^\s])\)/u.exec(ua))) {
        this.data.os.name = 'Android';

        this.data.device.model = match[1];
        this.data.device.identified |= Constants.id.PATTERN;

        const device = DeviceModels.identify('android', match[1]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if ((match = /\((?:Linux|MIDP-2.0); U; Adr ([0-9.]+)(?:-update[0-9])?; [^;]+; ([^;]*[^\s])\)/u.exec(ua))) {
        this.data.os.name = 'Android';
        this.data.os.version = new Version({value: match[1]});

        this.data.device.model = match[2];
        this.data.device.identified |= Constants.id.PATTERN;

        const device = DeviceModels.identify('android', match[2]);

        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if (/\((?:iOS|iPhone);/u.test(ua)) {
        this.data.os.name = 'iOS';
        this.data.os.version = new Version({value: '1.0'});

        if ((match = /OS[_ ]([0-9_]*);/u.exec(ua))) {
          this.data.os.version = new Version({
            value: match[1].replace(/_/g, '.'),
          });
        }

        if ((match = /; ([^;]+)\)/u.exec(ua))) {
          const device = DeviceModels.identify('ios', match[1]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }

      if (/\(Symbian;/u.test(ua)) {
        this.data.os.name = 'Series60';
        this.data.os.version = null;
        this.data.os.family = new Family({name: 'Symbian'});

        if ((match = /S60 V([0-9])/u.exec(ua))) {
          this.data.os.version = new Version({value: match[1]});
        }

        if ((match = /; Nokia([^;]+)\)/iu.exec(ua))) {
          this.data.device.model = match[1];
          this.data.device.identified |= Constants.id.PATTERN;

          const device = DeviceModels.identify('symbian', match[1]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }

      if (/\(Windows;/u.test(ua)) {
        this.data.os.name = 'Windows Phone';
        this.data.os.version = null;

        if ((match = /wds ([0-9]+\.[0-9])/u.exec(ua))) {
          switch (match[1]) {
            case '7.1':
              this.data.os.version = new Version({value: '7.5'});
              break;
            case '8.0':
              this.data.os.version = new Version({value: '8.0'});
              break;
            case '8.1':
              this.data.os.version = new Version({value: '8.1'});
              break;
            case '10.0':
              this.data.os.version = new Version({value: '10.0'});
              break;
          }
        }

        if ((match = /; ([^;]+); ([^;]+)\)/u.exec(ua))) {
          this.data.device.manufacturer = match[1];
          this.data.device.model = match[2];
          this.data.device.identified |= Constants.id.PATTERN;

          const device = DeviceModels.identify('wp', match[2]);

          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }
      }
    }

    if ((match = /Ucweb\/([0-9]*[.][0-9]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.version = new Version({value: match[1], details: 3});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if (/ucweb-squid/u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.channel = null;
    }

    if (/\) ?UC /u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.version = null;
      this.data.browser.channel = null;
      this.data.browser.mode = null;

      if (this.data.device.type === Constants.deviceType.DESKTOP) {
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.browser.mode = 'desktop';
      }
    }

    if ((match = /UC ?Browser\/?([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.channel = null;

      if (!this.data.device.type) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }
    }

    if ((match = /UBrowser\/?([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.channel = null;
    }

    if ((match = /UCLite\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.browser.channel = null;
    }

    /* U2 is the Proxy service used by UC Browser on low-end phones */
    if (/U2\//u.test(ua)) {
      this.data.browser.stock = false;
      this.data.browser.name = 'UC Browser';
      this.data.browser.mode = 'proxy';

      this.data.engine.name = 'Gecko';

      /* UC Browser running on Windows 8 is identifing itself as U2, but instead its a Trident Webview */
      if (this.data.os.name && typeof this.data.os.version !== 'undefined') {
        if (this.data.os.name === 'Windows Phone' && this.data.os.version.toFloat() >= 8) {
          this.data.engine.name = 'Trident';
          this.data.browser.mode = '';
        }
      }

      if (this.data.device.identified < Constants.id.MATCH_UA && (match = /; ([^;]*)\) U2\//u.exec(ua))) {
        const device = DeviceModels.identify('android', match[1]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;

          if (
            !this.data.os.name ||
            (this.data.os.name !== 'Android' &&
              (!this.data.os.family || this.data.os.family.getName() !== 'Android'))
          ) {
            this.data.os.name = 'Android';
          }
        }
      }
    }

    /* U3 is the Webkit based Webview used on Android phones */
    if (/U3\//u.test(ua)) {
      this.data.engine.name = 'Webkit';
    }
  }

  static detectUCEngine(ua) {
    if (this.data.browser.name) {
      if (this.data.browser.name === 'UC Browser') {
        if (
          !/UBrowser\//.test(ua) &&
          (this.data.device.type === 'desktop' ||
            (this.data.os.name && (this.data.os.name === 'Windows' || this.data.os.name === 'OS X')))
        ) {
          this.data.device.type = Constants.deviceType.MOBILE;
          this.data.browser.mode = 'desktop';
          this.data.engine.reset();
          this.data.os.reset();
        } else if (
          !this.data.os.name ||
          (this.data.os.name !== 'iOS' &&
            this.data.os.name !== 'Windows Phone' &&
            this.data.os.name !== 'Windows' &&
            this.data.os.name !== 'Android' &&
            (!this.data.os.family || this.data.os.family.getName() !== 'Android'))
        ) {
          this.data.engine.name = 'Gecko';
          this.data.engine.version = null;
          this.data.browser.mode = 'proxy';
        }

        if (this.data.engine.name && this.data.engine.name === 'Presto') {
          this.data.engine.name = 'Webkit';
          this.data.engine.version = null;
        }
      }
    }
  }

  /* Netfront */

  static detectNetfront(ua) {
    let match;
    if (!/(CNF|NF|NetFront|NX|Ave|COM2)/iu.test(ua)) {
      return;
    }

    /* Compact NetFront */

    if ((match = /CNF\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Compact NetFront';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* NetFront */

    if (/Net[fF]ront/u.test(ua) && !/NetFrontNX/u.test(ua)) {
      this.data.browser.name = 'NetFront';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = null;

      if ((match = /NetFront[ /]?([0-9.]*)/iu.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      /* Detect device type based on NetFront identifier */

      if (/MobilePhone/u.test(ua)) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      if (/DigitalMediaPlayer/u.test(ua)) {
        this.data.device.type = Constants.deviceType.MEDIA;
      }

      if (/PDA/u.test(ua)) {
        this.data.device.type = Constants.deviceType.PDA;
      }

      if (/MFP/u.test(ua)) {
        this.data.device.type = Constants.deviceType.PRINTER;
      }

      if (/(InettvBrowser|HbbTV|DTV|NetworkAVTV|BDPlayer)/u.test(ua)) {
        this.data.device.type = Constants.deviceType.TELEVISION;
      }

      if (/VCC/u.test(ua)) {
        this.data.device.type = Constants.deviceType.CAR;
      }

      if (/Kindle/u.test(ua)) {
        this.data.device.type = Constants.deviceType.EREADER;
      }

      if (!this.data.device.type) {
        this.data.device.type = Constants.deviceType.MOBILE;
      }

      /* Detect OS based on NetFront identifier */

      if (/NF[0-9][0-9](?:WMPRO|PPC)\//iu.test(ua)) {
        if (!this.data.isOs('Windows Mobile')) {
          this.data.os.reset({
            name: 'Windows Mobile',
          });
        }
      }
    }

    if (
      (match = /(?:Browser\/(?:NF|NetFr?ont-)|NF-Browser\/|ACS-NF\/|NetFront FullBrowser\/)([0-9.]*)/iu.exec(ua))
    ) {
      this.data.browser.name = 'NetFront';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = null;

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* AVE-Front */

    if ((match = /(?:AVE-Front|AveFront)\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'NetFront';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Category=([^);]+)[);]/u.exec(ua))) {
        switch (match[1]) {
          case 'WebPhone':
            this.data.device.type = Constants.deviceType.MOBILE;
            this.data.device.subtype = Constants.deviceSubType.DESKTOP;
            break;
          case 'WP':
          case 'Home Mail Tool':
          case 'PDA':
            this.data.device.type = Constants.deviceType.PDA;
            break;
          case 'STB':
            this.data.device.type = Constants.deviceType.TELEVISION;
            break;
          case 'GAME':
            this.data.device.type = Constants.deviceType.GAMING;
            this.data.device.subtype = Constants.deviceSubType.CONSOLE;
            break;
        }
      }

      if ((match = /Product=([^);]+)[);]/u.exec(ua))) {
        if (['ACCESS/NFPS', 'SUNSOFT/EnjoyMagic'].includes(match[1])) {
          this.data.device.setIdentification({
            manufacturer: 'Sony',
            model: 'Playstation 2',
            type: Constants.deviceType.GAMING,
            subtype: Constants.deviceSubType.CONSOLE,
          });
        }
      }
    }

    /* Netfront NX */

    if ((match = /NX[/ ]([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'NetFront NX';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = null;

      if (!this.data.device.type || this.data.isType('desktop')) {
        if (/(DTV|HbbTV)/iu.test(ua)) {
          this.data.device.type = Constants.deviceType.TELEVISION;
        } else {
          this.data.device.type = Constants.deviceType.DESKTOP;
        }
      }

      this.data.os.reset();
    }

    /* The Sony Mylo 2 identifies as Firefox 2, but is NetFront */

    if (/Sony\/COM2/u.test(ua)) {
      this.data.browser.reset({
        name: 'NetFront',
        type: Constants.browserType.BROWSER,
      });
    }
  }

  /* Obigo */
  static detectObigo(ua) {
    const processObigoVersion = function(version) {
      const result = {
        value: version,
      };

      if (/[0-9.]+/.test(version)) {
        result['details'] = 2;
      }
      let match;
      if ((match = /([0-9])[A-Z]/.exec(version))) {
        result['value'] = Number(match[1]);
        result['alias'] = version;
      }

      return result;
    };

    let match;
    if (/(?:Obigo|Teleca|AU-MIC|MIC\/)/iu.test(ua)) {
      this.data.browser.name = 'Obigo';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Obigo\/0?([0-9.]+)/iu.exec(ua))) {
        this.data.browser.version = new Version(processObigoVersion(match[1]));
      } else if ((match = /(?:MIC|TelecaBrowser)\/(WAP|[A-Z])?0?([0-9.]+[A-Z]?)/iu.exec(ua))) {
        this.data.browser.version = new Version(processObigoVersion(match[2]));
        if (match[1]) {
          this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
        }
      } else if (
        (match = /(?:Obigo(?:InternetBrowser|[- ]Browser)?|Teleca)\/(WAP|[A-Z])?[0O]?([0-9.]+[A-Z]?)/iu.exec(ua))
      ) {
        this.data.browser.version = new Version(processObigoVersion(match[2]));
        if (match[1]) {
          this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
        }
      } else if ((match = /(?:Obigo|Teleca)[- ]([WAP|[A-Z])?0?([0-9.]+[A-Z]?)(?:[0-9])?(?:[/;]|$)/iu.exec(ua))) {
        this.data.browser.version = new Version(processObigoVersion(match[2]));
        if (match[1]) {
          this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
        }
      } else if ((match = /Browser\/(?:Obigo|Teleca)[_-]?(?:Browser\/)?(WAP|[A-Z])?0?([0-9.]+[A-Z]?)/iu.exec(ua))) {
        this.data.browser.version = new Version(processObigoVersion(match[2]));
        if (match[1]) {
          this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
        }
      } else if ((match = /Obigo Browser (WAP|[A-Z])?0?([0-9.]+[A-Z]?)/iu.exec(ua))) {
        this.data.browser.version = new Version(processObigoVersion(match[2]));
        if (match[1]) {
          this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
        }
      }
    }

    if ((match = /[^A-Z](Q)0?([0-9][A-Z])/u.exec(ua))) {
      this.data.browser.name = `Obigo ${match[1].toUpperCase()}`;
      this.data.browser.version = new Version(processObigoVersion(match[2]));
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* ANT Galio and ANT Fresco */

  static detectAnt(ua) {
    let match;
    if ((match = /ANTFresco\/([0-9.]+)/iu.exec(ua))) {
      this.data.browser.name = 'ANT Fresco';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /ANTGalio\/([0-9.]+)/iu.exec(ua))) {
      this.data.browser.name = 'ANT Galio';
      this.data.browser.version = new Version({value: match[1], details: 3});
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* Seraphic Sraf */

  static detectSraf(ua) {
    if (/sraf_tv_browser/u.test(ua)) {
      this.data.browser.name = 'Seraphic Sraf';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.TELEVISION;
    }
    let match;
    if ((match = /SRAF\/([0-9.]+)/iu.exec(ua))) {
      this.data.browser.name = 'Seraphic Sraf';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.TELEVISION;
    }
  }

  /* MachBlue */

  static detectMachBlue(ua) {
    let match;
    if ((match = /mbxtWebKit\/([0-9.]*)/u.exec(ua))) {
      this.data.os.name = '';
      this.data.browser.name = 'MachBlue XT';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.TELEVISION;
    }

    if (ua === 'MachBlue') {
      this.data.os.name = '';
      this.data.browser.name = 'MachBlue XT';
      this.data.device.type = Constants.deviceType.TELEVISION;
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  /* Espial */

  static detectEspial(ua) {
    if (/Espial/u.test(ua)) {
      this.data.browser.name = 'Espial';
      this.data.browser.channel = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.os.name = '';
      this.data.os.version = null;

      if (this.data.device.type !== Constants.deviceType.TELEVISION) {
        this.data.device.type = Constants.deviceType.TELEVISION;
        this.data.device.manufacturer = null;
        this.data.device.model = null;
      }
      let match;
      if ((match = /Espial(?: Browser|TVBrowser)?\/(?:sig)?([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if ((match = /;(L6200|L7200)/u.exec(ua))) {
        this.data.device.manufacturer = 'Toshiba';
        this.data.device.model = `Regza ${match[1]}`;
        this.data.device.series = 'Smart TV';
        this.data.device.identified |= Constants.id.MATCH_UA;
        this.data.device.generic = false;
      }
    }
  }

  /* Iris */

  static detectIris(ua) {
    if (/Iris\//u.test(ua)) {
      this.data.browser.name = 'Iris';
      this.data.browser.hidden = false;
      this.data.browser.stock = false;
      this.data.browser.type = Constants.browserType.BROWSER;
      let match;
      if ((match = /Iris\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if ((match = / WM([0-9]) /u.exec(ua))) {
        this.data.device.reset();
        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.os.reset();
        this.data.os.name = 'Windows Mobile';
        this.data.os.version = new Version({value: `${match[1]}.0`});
      }

      if (/Windows NT/u.test(ua)) {
        this.data.browser.mode = 'desktop';

        this.data.device.reset();
        this.data.device.type = Constants.deviceType.MOBILE;

        this.data.os.reset();
        this.data.os.name = 'Windows Mobile';
      }
    }
  }

  /* Dolfin */

  static detectDolfin(ua) {
    if (/(Dolfin|Jasmine)/u.test(ua)) {
      this.data.browser.name = 'Dolfin';
      this.data.browser.type = Constants.browserType.BROWSER;
      let match;
      if ((match = /(?:Dolfin|Jasmine)\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if ((match = /Browser\/Dolfin([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }
  }

  /* WebOS */

  static detectWebOSBrowser(ua) {
    if (/wOSBrowser/u.test(ua)) {
      this.data.browser.name = 'webOS Browser';
      this.data.browser.type = Constants.browserType.BROWSER;

      if (this.data.os.name !== 'webOS') {
        this.data.os.name = 'webOS';
      }

      if (this.data.device.manufacturer && this.data.device.manufacturer === 'Apple') {
        this.data.device.manufacturer = null;
        this.data.device.model = null;
        this.data.device.identified = Constants.id.NONE;
      }
    }
  }

  /* Sailfish */

  static detectSailfishBrowser(ua) {
    if (/Sailfish ?Browser/u.test(ua)) {
      this.data.browser.name = 'Sailfish Browser';
      this.data.browser.stock = true;
      this.data.browser.type = Constants.browserType.BROWSER;
      let match;
      if ((match = /Sailfish ?Browser\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 2,
        });
      }
    }
  }

  /* Silk */

  static detectSilk(ua) {
    if (/Silk/u.test(ua)) {
      if (/Silk-Accelerated/u.test(ua) || !/PlayStation/u.test(ua)) {
        this.data.browser.name = 'Silk';
        this.data.browser.channel = null;
        this.data.browser.type = Constants.browserType.BROWSER;
        let match;
        if ((match = /Silk\/([0-9.]*)/u.exec(ua))) {
          this.data.browser.version = new Version({
            value: match[1],
            details: 2,
          });
        }

        if ((match = /; ([^;]*[^;\s])\s+Build/u.exec(ua))) {
          this.data.device = DeviceModels.identify('android', match[1]);
        }

        if (!this.data.device.identified) {
          this.data.device.manufacturer = 'Amazon';
          this.data.device.model = 'Kindle Fire';
          this.data.device.type = Constants.deviceType.TABLET;
          this.data.device.identified |= Constants.id.INFER;

          if (this.data.os.name && (this.data.os.name !== 'Android' || this.data.os.name !== 'FireOS')) {
            this.data.os.name = 'FireOS';
            this.data.os.family = new Family({name: 'Android'});
            this.data.os.alias = null;
            this.data.os.version = null;
          }
        }
      }
    }
  }

  /* Nokia */

  static detectNokiaBrowser(ua) {
    if (!/(BrowserNG|Nokia|OSRE|Ovi|Maemo)/iu.test(ua)) {
      return;
    }

    /* Nokia Browser */
    let match;
    if (/BrowserNG/u.test(ua)) {
      this.data.browser.name = 'Nokia Browser';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /BrowserNG\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
          builds: false,
        });
      }
    }

    if (/NokiaBrowser/u.test(ua)) {
      this.data.browser.name = 'Nokia Browser';
      this.data.browser.channel = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /NokiaBrowser\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }
    }

    if (/Nokia-Communicator-WWW-Browser/u.test(ua)) {
      this.data.browser.name = 'Nokia Browser';
      this.data.browser.channel = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Nokia-Communicator-WWW-Browser\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }
    }

    /* Nokia Xpress for S30+, S40 and Windows Phone */

    if (/OSRE/u.test(ua)) {
      this.data.browser.name = 'Nokia Xpress';
      this.data.browser.mode = 'proxy';
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.MOBILE;

      this.data.os.name = null;
      this.data.os.version = null;
    }

    if (/S40OviBrowser/u.test(ua)) {
      this.data.browser.name = 'Nokia Xpress';
      this.data.browser.mode = 'proxy';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /S40OviBrowser\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }

      if ((match = /Nokia([^/]+)\//u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = match[1];
        this.data.device.identified |= Constants.id.PATTERN;

        if (this.data.device.model) {
          const device = DeviceModels.identify('s40', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.device = device;
          }
        }

        if (this.data.device.model) {
          const device = DeviceModels.identify('asha', this.data.device.model);
          if (device.identified) {
            device.identified |= this.data.device.identified;
            this.data.os.name = 'Nokia Asha Platform';
            this.data.os.version = new Version({value: '1.0'});
            this.data.device = device;

            if ((match = /java_runtime_version=Nokia_Asha_([0-9_]+);/u.exec(ua))) {
              this.data.os.version = new Version({
                value: match[1].replace(/_/g, '.'),
              });
            }
          }
        }
      }

      if ((match = /NOKIALumia([0-9]+)/u.exec(ua))) {
        this.data.device.manufacturer = 'Nokia';
        this.data.device.model = match[1];
        this.data.device.identified |= Constants.id.PATTERN;

        const device = DeviceModels.identify('wp', this.data.device.model);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
          this.data.os.name = 'Windows Phone';
        }
      }
    }

    /* MicroB - the default browser for maemo */

    if (/Maemo[ |_]Browser/u.test(ua)) {
      this.data.browser.name = 'MicroB';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Maemo[ |_]Browser[ |_]([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }
    }
  }

  /* Konqueror */

  static detectKonqueror(ua) {
    if (/[k|K]onqueror\//u.test(ua)) {
      this.data.browser.name = 'Konqueror';
      this.data.browser.type = Constants.browserType.BROWSER;
      let match;
      if ((match = /[k|K]onqueror\/([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      if (this.data.device.type === '') {
        this.data.device.type = Constants.deviceType.DESKTOP;
      }
    }
  }

  /* OmniWeb */

  static detectOmniWeb(ua) {
    if (/OmniWeb/u.test(ua)) {
      this.data.browser.name = 'OmniWeb';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.version = null;

      let match;
      if ((match = /OmniWeb\/v?([0-9])[0-9][0-9]/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 1,
        });
      }

      if ((match = /OmniWeb\/([0-9]\.[0-9.]+)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }

      this.data.device.reset({
        type: Constants.deviceType.DESKTOP,
      });

      if (this.data.browser.version) {
        if (this.data.browser.version.is('<', 3)) {
          this.data.os.name = 'NextStep';
          this.data.os.version = null;
        }

        if (this.data.browser.version.is('>=', 4)) {
          if (!this.data.os.name || this.data.os.name !== 'OS X') {
            this.data.os.name = 'OS X';
            this.data.os.version = null;
          }
        }
      }
    }
  }

  /* Other browsers */

  static detectDesktopBrowsers(ua) {
    if (!/(WebPositive|WebExplorer|WorldWideweb|Midori|Maxthon|Browse)/iu.test(ua)) {
      return;
    }

    /* WebPositive */
    let match;
    if (/WebPositive/u.test(ua)) {
      this.data.browser.name = 'WebPositive';
      this.data.browser.channel = '';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /WebPositive\/([0-9]\.[0-9.]+)/u.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }
    }

    /* IBM WebExplorer */

    if (/IBM[- ]WebExplorer[ -]?(DLL ?|Window API ?)?/u.test(ua)) {
      this.data.browser.name = 'IBM WebExplorer';
      this.data.browser.channel = '';
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /IBM[- ]WebExplorer[ -]?(?:DLL ?|Window API ?)?\/v([0-9]\.[0-9.]+)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }

      this.data.os.name = 'OS/2';
      this.data.device.type = 'desktop';
    }

    /* WorldWideweb */

    if (/WorldWideweb \(NEXT\)/u.test(ua)) {
      this.data.browser.name = 'WorldWideWeb';
      this.data.browser.channel = '';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.os.name = 'NextStep';
      this.data.device.type = 'desktop';
    }

    /* Midori */

    if ((match = /Midori\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Midori';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.manufacturer = null;
      this.data.device.model = null;
      this.data.device.type = Constants.deviceType.DESKTOP;

      if (this.data.os.name && this.data.os.name === 'OS X') {
        this.data.os.name = null;
        this.data.os.version = null;
      }
    }

    if (/midori(?:\/[0-9.]*)?$/u.test(ua)) {
      this.data.browser.name = 'Midori';
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.DESKTOP;

      if ((match = /midori\/([0-9.]*)$/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    /* Maxthon */

    if ((match = /Maxthon/iu.exec(ua))) {
      this.data.browser.name = 'Maxthon';
      this.data.browser.channel = '';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /Maxthon[/' ]\(?([0-9.]*)\)?/iu.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }

      if (
        this.data.os.name &&
        this.data.browser.version &&
        this.data.os.name === 'Windows' &&
        this.data.browser.version.toFloat() < 4
      ) {
        this.data.browser.version.details = 1;
      }
    }

    /* Browse for Remix OS */

    if ((match = /^Browse\/([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'Browse';
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }

  static detectMobileBrowsers(ua) {
    if (
      !/(Ninesky|Skyfire|Dolphin|QQ|360|QHBrowser|Mercury|iBrowser|Puffin|MiniB|MxNitro|Sogou|Xiino|Palmscape|WebPro|Vision|MiuiBrowser)/iu.test(
        ua
      )
    ) {
      return;
    }

    let match;
    /* Xiaomi MIUI Browser */
    if ((match = /MiuiBrowser\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'MIUI Browser';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
      if (!this.data.os.isFamily('Android')) {
        this.data.os.reset();
        this.data.os.name = 'Android';
        this.data.device.manufacturer = 'Xiaomi';
        this.data.device.model = null;
        this.data.device.type = Constants.deviceType.MOBILE;
      }
    }

    /* NineSky */

    if ((match = /Ninesky(?:-android-mobile(?:-cn)?)?\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.reset();
      this.data.browser.name = 'NineSky';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (this.data.device.manufacturer && this.data.device.manufacturer === 'Apple') {
        this.data.device.reset();
      }

      if (!this.data.os.isFamily('Android')) {
        this.data.os.reset();
        this.data.os.name = 'Android';
      }

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* Skyfire */

    if ((match = /Skyfire\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Skyfire';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.MOBILE;

      this.data.os.name = 'Android';
      this.data.os.version = null;
    }

    /* Dolphin HD */

    if ((match = /Dolphin(?:HD|Browser)?(?:INT|CN)?\/(?:INT|CN)?-?([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Dolphin';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.MOBILE;
    }

    /* QQ Browser */

    if ((match = /(M?QQBrowser)\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'QQ Browser';

      let version = match[2];
      if (/^[0-9][0-9]$/u.test(version)) {
        version = `${version[0]}.${version[1]}`;
      }

      this.data.browser.version = new Version({value: version, details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = '';

      if (!this.data.os.name && match[1] === 'QQBrowser') {
        this.data.os.name = 'Windows';
      }

      if ((match = /MQQBrowser\/[0-9.]+\/Adr \(Linux; U; ([0-9.]+); [^;]+; (.+) Build/u.exec(ua))) {
        this.data.os.reset({
          name: 'Android',
          version: new Version({value: match[1]}),
        });

        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.device.model = match[2];
        this.data.device.identified |= Constants.id.PATTERN;

        const device = DeviceModels.identify('android', match[2]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }

      if ((match = /MQQBrowser\/[0-9.]+\/WP7 \([^;]+;WPOS:([0-9]\.[0-9])[0-9.]*;([^;]+); ([^)]+)\)/u.exec(ua))) {
        this.data.os.reset({
          name: 'Windows Phone',
          version: new Version({value: match[1]}),
        });

        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.device.manufacturer = match[2];
        this.data.device.model = match[3];
        this.data.device.identified |= Constants.id.PATTERN;

        const device = DeviceModels.identify('wp', match[3]);
        if (device.identified) {
          device.identified |= this.data.device.identified;
          this.data.device = device;
        }
      }
    }

    if ((match = /MQQBrowser\/Mini([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'QQ Browser Mini';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = '';
    }

    if ((match = /QQ\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'QQ Browser';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.channel = '';
    }

    /* 360 Phone Browser */
    if (/360 (?:Aphone|Android Phone) Browser/u.test(ua)) {
      this.data.browser.name = 'Qihoo 360 Browser';
      this.data.browser.family = null;
      this.data.browser.channel = '';
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /360 (?:Aphone|Android Phone) Browser \((?:Version |V)?([0-9.]*)(?:beta)?\)/u.exec(ua))) {
      this.data.browser.name = 'Qihoo 360 Browser';
      this.data.browser.family = null;
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (!this.data.os.isFamily('Android')) {
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.os.reset({
          name: 'Android',
        });
      }
    }

    if ((match = /360%20(?:Browser|Lite)\/([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'Qihoo 360 Browser';
      this.data.browser.family = null;
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /QHBrowser\/([0-9.]+)/u.exec(ua))) {
      let version = match[1];
      if (/^[0-9][0-9][0-9]$/u.test(version)) {
        version = `${version[0]}.${version[1]}.${version[2]}`;
      }

      this.data.browser.name = 'Qihoo 360 Browser';
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: version});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (!this.data.isOs('iOS')) {
        this.data.device.type = Constants.deviceType.MOBILE;
        this.data.os.reset({
          name: 'iOS',
        });
      }
    }

    /* Mercury */

    if ((match = /(?:^| )Mercury\/([0-9.]+)/u.exec(ua))) {
      let version = match[1];
      if (/^[0-9][0-9][0-9]$/u.test(version)) {
        version = `${version[0]}.${version[1]}.${version[2]}`;
      }

      this.data.browser.name = 'Mercury Browser';
      this.data.browser.channel = '';
      this.data.browser.version = new Version({value: version});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    /* iBrowser */

    if ((match = /(?:^| )iBrowser\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'iBrowser';

      let version = match[1];
      if (/^[0-9][0-9]$/u.test(version)) {
        version = `${version[0]}.${version[1]}`;
      }

      this.data.browser.version = new Version({value: version, details: 2});
      this.data.browser.channel = '';
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    if ((match = /iBrowser\/Mini([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'iBrowser Mini';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.channel = '';
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    /* Puffin */

    if ((match = /Puffin\/([0-9.]+)([IA])?([PT])?/u.exec(ua))) {
      this.data.browser.name = 'Puffin';
      this.data.browser.version = new Version({
        value: match[1],
        details: parseInt(match[1].substr(match[1].lastIndexOf('.')).substr(1), 10) > 99 ? -1 : null,
      });
      this.data.browser.mode = 'proxy';
      this.data.browser.channel = '';
      this.data.browser.type = Constants.browserType.BROWSER;

      if (match[2]) {
        switch (match[2]) {
          case 'A':
            if (!this.data.isOs('Android')) {
              this.data.os.reset({name: 'Android'});
            }
            break;

          case 'I':
            if (!this.data.isOs('iOS')) {
              this.data.os.reset({name: 'iOS'});
            }
            break;
        }
      }

      if (match[3]) {
        switch (match[3]) {
          case 'P':
            this.data.device.type = Constants.deviceType.MOBILE;
            if (this.data.os.name === 'iOS' && !this.data.device.model) {
              this.data.device.manufacturer = 'Apple';
              this.data.device.model = 'iPhone';
              this.data.device.identified = Constants.id.MATCH_UA;
            }
            break;

          case 'T':
            this.data.device.type = Constants.deviceType.TABLET;
            if (this.data.os.name === 'iOS' && !this.data.device.model) {
              this.data.device.manufacturer = 'Apple';
              this.data.device.model = 'iPad';
              this.data.device.identified = Constants.id.MATCH_UA;
            }
            break;
        }
      }
    }

    /* MiniBrowser Mobile */

    if ((match = /MiniBr?owserM(?:obile)?\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'MiniBrowser';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.MOBILE;

      if (!this.data.isOs('Series60')) {
        this.data.os.name = 'Series60';
        this.data.os.version = null;
      }
    }

    /* Maxthon */

    if ((match = /MxNitro/iu.exec(ua))) {
      this.data.browser.name = 'Maxthon Nitro';
      this.data.browser.channel = '';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /MxNitro\/([0-9.]*)/iu.exec(ua))) {
        this.data.browser.version = new Version({
          value: match[1],
          details: 3,
        });
      }
    }

    /* Sogou Mobile */

    if ((match = /SogouAndroidBrowser\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Sogou Mobile';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (this.data.device.manufacturer && this.data.device.manufacturer === 'Apple') {
        this.data.device.manufacturer = null;
        this.data.device.model = null;
        this.data.device.identified = Constants.id.NONE;
      }
    }

    /* Xiino */

    if ((match = /Xiino\/([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'Xiino';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.PDA;

      this.data.os.name = 'Palm OS';

      if ((match = /\(v. ([0-9.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* Palmscape */

    if ((match = /Palmscape\/(?:PR)?([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'Palmscape';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.type = Constants.deviceType.PDA;

      this.data.os.name = 'Palm OS';

      if ((match = /\(v. ([0-9.]+)/u.exec(ua))) {
        this.data.os.version = new Version({value: match[1]});
      }
    }

    /* Novarra WebPro */

    if (/WebPro/u.test(ua) && /PalmOS/u.test(ua)) {
      this.data.browser.name = 'WebPro';
      this.data.browser.version = null;
      this.data.browser.type = Constants.browserType.BROWSER;

      if ((match = /WebPro\/?([0-9.]*)/u.exec(ua))) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    /* Novarra Vision */

    if ((match = /(?:Vision-Browser|Novarra-Vision)\/?([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Novarra Vision';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.family = null;
      this.data.browser.mode = 'proxy';
      this.data.browser.type = Constants.browserType.BROWSER;

      if (this.data.device.type !== Constants.deviceType.MOBILE) {
        this.data.os.reset();
        this.data.device.type = Constants.deviceType.MOBILE;
      }
    }
  }

  static detectTelevisionBrowsers(ua) {
    if (!/(Roku|LG Browser|NetCast|SonyBrowserCore|Dream|Planetweb)/iu.test(ua)) {
      return;
    }

    /* Web on Roku */
    let match;
    if (/Roku/u.test(ua) && (match = /Web\/([0-9.]+)/u.exec(ua))) {
      this.data.browser.name = 'Web';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
    }

    /* LG Browser */

    if ((match = /LG Browser\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'LG Browser';
      this.data.browser.version = new Version({value: match[1], details: 2});
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.device.type = Constants.deviceType.TELEVISION;
    }

    if (/NetCast/u.test(ua) && /SmartTV\//u.test(ua)) {
      this.data.browser.name = null;
      this.data.browser.version = null;
    }

    /* Sony Browser */

    if (/SonyBrowserCore\/([0-9.]*)/u.test(ua)) {
      this.data.browser.name = null;
      this.data.browser.version = null;
      this.data.device.type = Constants.deviceType.TELEVISION;
    }

    /* Dreamkey */

    if ((match = /DreamKey\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Dreamkey';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.setIdentification({
        manufacturer: 'Sega',
        model: 'Dreamcast',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Dream Passport */

    if ((match = /DreamPassport\/([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Dream Passport';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      this.data.device.setIdentification({
        manufacturer: 'Sega',
        model: 'Dreamcast',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });
    }

    /* Planetweb */

    if ((match = /Planetweb\/v?([0-9.]*)/u.exec(ua))) {
      this.data.browser.name = 'Planetweb';
      this.data.browser.version = new Version({value: match[1]});
      this.data.browser.type = Constants.browserType.BROWSER;

      if (/Dreamcast/u.test(ua)) {
        this.data.device.setIdentification({
          manufacturer: 'Sega',
          model: 'Dreamcast',
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });
      }

      if (/SPS/u.test(ua)) {
        this.data.device.setIdentification({
          manufacturer: 'Sony',
          model: 'Playstation 2',
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });
      }
    }
  }

  static detectRemainingBrowsers(ua) {
    const data = Applications.identifyBrowser(ua);
    if (data) {
      this.data.browser.set(data['browser']);

      if (data['device']) {
        this.data.device.set(data['device']);
      }
    }
  }

  static detectWapBrowsers(ua) {
    if (!/(Dorado|MAUI)/iu.test(ua)) {
      return;
    }
    let match;
    if ((match = /Browser\/Dorado([0-9.]*)/iu.exec(ua))) {
      this.data.browser.name = 'Dorado WAP';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.version = new Version({value: match[1], details: 2});
    }

    if ((match = /Dorado WAP-Browser\/([0-9.]*)/iu.exec(ua))) {
      this.data.browser.name = 'Dorado WAP';
      this.data.browser.type = Constants.browserType.BROWSER;
      this.data.browser.version = new Version({value: match[1], details: 2});
    }

    if ((match = /MAUI[ _]WAP[ _]Browser(?:\/([0-9.]*))?/iu.exec(ua))) {
      this.data.browser.name = 'MAUI WAP';
      this.data.browser.type = Constants.browserType.BROWSER;

      if (match[1]) {
        this.data.browser.version = new Version({value: match[1]});
      }
    }

    if (/WAP Browser\/MAUI/iu.test(ua)) {
      this.data.browser.name = 'MAUI WAP';
      this.data.browser.type = Constants.browserType.BROWSER;
    }
  }
}

module.exports = Browser;

/* eslint-enable require-jsdoc */
