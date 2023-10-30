const {describe, it} = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Browser = require('../../src/model/Browser');
const Version = require('../../src/model/Version');
const Family = require('../../src/model/Family');
const Using = require('../../src/model/Using');

describe('Browser Class', () => {
  describe('test defaults', () => {
    it('should be as expected', () => {
      const browser = new Browser();
      expect(browser.stock).to.be.true();
      expect(browser.hidden).to.be.false();
      expect(browser.mode).to.be.equal('');
      expect(browser.type).to.be.equal('');
    });
  });

  describe('test reset', () => {
    it('should reset to defaults', () => {
      const browser = new Browser({
        stock: false,
        hidden: true,
        mode: 'xxxx',
        type: 'xxxx',
      });

      expect(browser.stock).to.be.false();
      expect(browser.hidden).to.be.true();
      expect(browser.mode).to.be.equal('xxxx');
      expect(browser.type).to.be.equal('xxxx');

      browser.reset();

      expect(browser.stock).to.be.true();
      expect(browser.hidden).to.be.false();
      expect(browser.mode).to.be.equal('');
      expect(browser.type).to.be.equal('');
    });
  });

  describe('test getName method', () => {
    it('should return the name', () => {
      const browser = new Browser({
        name: 'Chrome',
        version: new Version({value: '47.0.2526.73', details: 1}),
      });
      expect(browser.getName()).to.be.equal('Chrome');
    });
  });

  describe('test getVersion method', () => {
    describe('without details property', () => {
      it('should return the entire version', () => {
        const browser = new Browser({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73'}),
        });

        expect(browser.getVersion()).to.equal('47.0.2526.73');
      });
    });

    describe('without details property', () => {
      it('should return the entire version', () => {
        const browser = new Browser({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });

        expect(browser.getVersion()).to.equal('47');
      });
    });
  });

  describe('test isDetected method', () => {
    it('should return true', () => {
      const browser = new Browser();
      expect(browser.isDetected()).to.be.false();
      browser.reset({
        name: 'Chrome',
        version: new Version({value: '47.0.2526.73', details: 1}),
      });
      expect(browser.isDetected()).to.be.true();
    });
  });

  describe('test isFamily method', () => {
    describe('with no initialization', () => {
      it('should return false', () => {
        const browser = new Browser();

        expect(browser.isFamily('Chrome')).to.be.false();
      });
    });

    describe('with correct family', () => {
      it('should return true', () => {
        const browser = new Browser({
          name: 'Opera',
          family: new Family({name: 'Chrome'}),
        });

        expect(browser.isFamily('Chrome')).to.be.true();
      });
    });

    describe('with wrong family', () => {
      it('should return true', () => {
        const browser = new Browser({
          name: 'Opera',
          family: new Family({name: 'Chrome'}),
        });

        expect(browser.isFamily('Firefox')).to.be.false();
      });
    });
  });

  describe('test toString method', () => {
    describe('with version details property', () => {
      it('should return the name and version', () => {
        const browser = new Browser({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });

        expect(browser.toString()).to.be.equal('Chrome 47');
      });
    });

    describe('with hidden set to true ', () => {
      it('should return an empty string', () => {
        const browser = new Browser({
          name: 'Safari',
          hidden: true,
          version: new Version({value: '8.0'}),
        });

        expect(browser.toString()).to.be.equal('');
      });
    });

    describe('with name and using property', () => {
      it('should return the name', () => {
        const browser = new Browser({
          name: 'TestBrowser',
          using: new Using({name: 'Crosswalk Webview'}),
        });

        expect(browser.toString()).to.be.equal('TestBrowser');
      });
    });

    describe('without name and with using property', () => {
      it('should return the name', () => {
        const browser = new Browser({
          using: new Using({name: 'Crosswalk Webview'}),
        });

        expect(browser.toString()).to.be.equal('Crosswalk Webview');
      });
    });

    describe('with name and hidden set to true ', () => {
      it('should return an empty string', () => {
        const browser = new Browser({
          name: 'BlackBerry Browser',
          hidden: true,
        });

        expect(browser.toString()).to.be.equal('');
      });
    });
  });

  describe('test identifyVersion method', () => {
    describe('with matching RegExp and details set to 1 ', () => {
      it('should return the major version', () => {
        const browser = new Browser();

        browser.identifyVersion(/Chrome\/([0-9.]+)/u, 'Chrome/47.0.2526.73', {details: 1});

        expect(browser.getVersion()).to.be.equal('47');
      });
    });

    describe('with matching RegExp and legacy type', () => {
      it('should return the version in the current format', () => {
        const browser = new Browser();

        browser.identifyVersion(/Mozilla\/([0-9.]+)/u, 'Mozilla/2.03', {type: 'legacy'});

        expect(browser.getVersion()).to.be.equal('2.0.3');
      });
    });

    describe('with not matching RegExp', () => {
      it('should return empty version', () => {
        const browser = new Browser();

        browser.identifyVersion(/Safari\/([0-9.]+)/u, 'Chrome/47.0.2526.73');

        expect(browser.getVersion()).to.be.empty();
      });
    });
  });

  describe('test toObject method', () => {
    describe('with name  empty', () => {
      it('should return an empty object', () => {
        const browser = new Browser({
          name: '',
        });

        expect(browser.toObject()).equal({});
      });
    });

    describe('with name and details filled', () => {
      it('should return the name value according to details level', () => {
        const browser = new Browser({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });

        expect(browser.toObject()).to.equal({name: 'Chrome', version: '47'});
      });
    });

    describe('with name and alias filled', () => {
      it('should return an object with name and alias properties', () => {
        const properties = {name: 'TestBrowser', alias: 'Alias'};
        const browser = new Browser(properties);

        expect(browser.toObject()).to.equal(properties);
      });
    });

    describe('with name and family filled', () => {
      it('should return an object with name and family properties', () => {
        const browser = new Browser({
          name: 'Opera',
          family: new Family({name: 'Chrome'}),
        });

        expect(browser.toObject()).to.equal({
          name: 'Opera',
          family: 'Chrome',
        });
      });
    });

    describe('with name and using filled', () => {
      it('should return an object with name and using properties', () => {
        const browser = new Browser({
          name: 'TestBrowser',
          using: new Using({name: 'Crosswalk WebView'}),
        });

        expect(browser.toObject()).to.equal({
          name: 'TestBrowser',
          using: 'Crosswalk WebView',
        });
      });
    });
  });
});
