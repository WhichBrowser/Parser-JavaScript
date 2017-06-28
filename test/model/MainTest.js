const {describe, it} = (exports.lab = require('Lab').script());
const expect = require('code').expect;
const Constants = require('../../src/constants');
const Main = require('../../src/model/Main');
const Browser = require('../../src/model/Browser');
const Engine = require('../../src/model/Engine');
const Os = require('../../src/model/Os');
const Device = require('../../src/model/Device');
const Version = require('../../src/model/Version');

describe('Browser Class', () => {
  describe('test defaults', () => {
    it('should be as expected', (done) => {
      const main = new Main();
      expect(main.browser).to.be.instanceOf(Browser);
      expect(main.engine).to.be.instanceOf(Engine);
      expect(main.os).to.be.instanceOf(Os);
      expect(main.device).to.be.instanceOf(Device);
      done();
    });
  });

  describe('test is Method', () => {
    describe('with empty object', () => {
      it('should return all false', (done) => {
        const main = new Main();

        expect(main.isBrowser('Chrome')).to.be.false();
        expect(main.isBrowser('Chrome', '=', '40')).to.be.false();
        expect(main.isOs('OS X')).to.be.false();
        expect(main.isEngine('WebKit')).to.be.false();

        done();
      });
    });

    describe('with browser object', () => {
      it('should work as expected', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Chrome',
          version: new Version({value: '40.0.2214', details: 1}),
        });

        expect(main.isBrowser('Chrome')).to.be.true();

        expect(main.isBrowser()).to.be.false();
        expect(main.isBrowser('Safari')).to.be.false();

        expect(main.isBrowser('Chrome', '=', '40')).to.be.true();
        expect(main.isBrowser('Chrome', '>=', '40')).to.be.true();
        expect(main.isBrowser('Chrome', '<=', '40')).to.be.true();
        expect(main.isBrowser('Chrome', '>', '39')).to.be.true();
        expect(main.isBrowser('Chrome', '<', '41')).to.be.true();

        expect(main.isBrowser('Chrome', '=', '39')).to.be.false();
        expect(main.isBrowser('Chrome', '>=', '41')).to.be.false();
        expect(main.isBrowser('Chrome', '<=', '29')).to.be.false();
        expect(main.isBrowser('Chrome', '>', '40')).to.be.false();
        expect(main.isBrowser('Chrome', '<', '40')).to.be.false();

        done();
      });
    });

    describe('with os object', () => {
      it('should work as expected', (done) => {
        const main = new Main();

        main.os.set({
          name: 'OS X',
          version: new Version({value: '10.11.1', details: 2}),
        });

        expect(main.isOs('OS X')).to.be.true();

        expect(main.isOs()).to.be.false();
        expect(main.isOs('Windows')).to.be.false();

        expect(main.isOs('OS X', '=', '10')).to.be.true();
        expect(main.isOs('OS X', '=', '10.11')).to.be.true();
        expect(main.isOs('OS X', '=', '10.11.1')).to.be.true();
        expect(main.isOs('OS X', '=', '10.11.01')).to.be.true();

        expect(main.isOs('OS X', '=', 10)).to.be.true();
        expect(main.isOs('OS X', '=', 10.11)).to.be.true();

        expect(main.isOs('OS X', '>', '10.1')).to.be.true();
        expect(main.isOs('OS X', '>', '10.01')).to.be.true();
        expect(main.isOs('OS X', '>', '10.10')).to.be.true();

        expect(main.isOs('OS X', '>', '10')).to.be.false();
        expect(main.isOs('OS X', '>', '10.11')).to.be.false();

        done();
      });
    });

    describe('with engine object', () => {
      it('should work as expected', (done) => {
        const main = new Main();

        main.engine.set({
          name: 'WebKit',
        });

        expect(main.isEngine('WebKit')).to.be.true();
        expect(main.isEngine('WebKit', '=', '523')).to.be.false();

        done();
      });
    });
  });


  describe('test isDevice method', () => {
    it('should return true for both model and manufacturer', (done) => {
      const main = new Main();

      main.device.setIdentification({
        manufacturer: 'Sony',
        model: 'PRS-T2',
        series: 'Reader',
      });
      expect(main.isDevice('Reader')).to.be.true();
      expect(main.isDevice('PRS-T2')).to.be.true();
      done();
    });
  });

  describe('test isDetected method', () => {
    it('should return true for both model and manufacturer', (done) => {
      const main = new Main();

      expect(main.isDetected()).to.be.false();

      main.browser.set({
        name: 'Chrome',
        version: new Version({value: '47.0.2526.73', details: 1}),
      });

      expect(main.isDetected()).to.be.true();

      done();
    });
  });

  describe('test isMobile method', () => {
    describe('with GAMING CONSOLE type', () => {
      it('should return false', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });

        expect(main.isMobile()).to.be.false();
        done();
      });
    });

    describe('with GAMING PORTABLE type', () => {
      it('should return true', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.PORTABLE,
        });

        expect(main.isMobile()).to.be.true();
        done();
      });
    });

    describe('with MOBILE SMART type', () => {
      it('should return true', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.SMART,
        });

        expect(main.isMobile()).to.be.true();
        done();
      });
    });

    describe('with MOBILE FEATURE type', () => {
      it('should return true', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.FEATURE,
        });

        expect(main.isMobile()).to.be.true();
        done();
      });
    });

    describe('with DESKTOP type', () => {
      it('should return true', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.DESKTOP,
        });

        expect(main.isMobile()).to.be.false();
        done();
      });
    });
  });

  describe('test isType method', () => {
    it('should work as expected', (done) => {
      const main = new Main();

      main.device.setIdentification({
        manufacturer: 'Nintendo',
        model: 'Wii',
        type: Constants.deviceType.GAMING,
        subtype: Constants.deviceSubType.CONSOLE,
      });

      expect(main.isType('gaming')).to.be.true();
      expect(main.isType('gaming:console')).to.be.true();

      expect(main.isType('mobile')).to.be.false();
      expect(main.isType('mobile:portable')).to.be.false();
      expect(main.isType('gaming:portable')).to.be.false();

      expect(main.isType('television', 'gaming')).to.be.true();
      expect(main.isType('gaming', 'television', 'gaming')).to.be.true();
      expect(main.isType('gaming:portable', 'gaming:console')).to.be.true();

      done();
    });
  });

  describe('test getType method', () => {
    describe('with only type GAMING', () => {
      it('should return the type', (done) => {
        const main = new Main();

        main.device.reset({type: Constants.deviceType.GAMING});

        expect(main.getType()).to.be.equal('gaming');

        done();
      });
    });

    describe('with type GAMING and subtypes', () => {
      it('should return the type:subtype', (done) => {
        const main = new Main();

        main.device.reset({
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });

        expect(main.getType()).to.be.equal('gaming:console');

        main.device.reset({
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.PORTABLE,
        });

        expect(main.getType()).to.be.equal('gaming:portable');

        done();
      });
    });

    describe('with only type MOBILE', () => {
      it('should return the type', (done) => {
        const main = new Main();

        main.device.reset({type: Constants.deviceType.MOBILE});

        expect(main.getType()).to.be.equal('mobile');

        done();
      });
    });

    describe('with type MOBILE and subtypes', () => {
      it('should return the type:subtype', (done) => {
        const main = new Main();

        main.device.reset({
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.SMART,
        });

        expect(main.getType()).to.be.equal('mobile:smart');

        main.device.reset({
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.FEATURE,
        });

        expect(main.getType()).to.be.equal('mobile:feature');

        done();
      });
    });
  });

  describe('test toString method', () => {
    describe('with empty object', () => {
      it('should return the name and version', (done) => {
        const main = new Main();

        expect(main.toString()).to.be.equal('an unknown browser');

        done();
      });
    });

    describe('with type set to BOT ', () => {
      it('should return an unknown BOT', (done) => {
        const main = new Main();

        main.device.set({
          type: Constants.deviceType.BOT,
        });

        expect(main.toString()).to.be.equal('an unknown bot');

        done();
      });
    });

    describe('with browser, engine and os set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });
        main.engine.set({
          name: 'Blink',
        });
        main.os.set({
          name: 'OS X',
          version: new Version({value: '10.11', nickname: 'El Captain'}),
        });

        expect(main.toString()).to.be.equal('Chrome 47 on OS X El Captain 10.11');

        done();
      });
    });

    describe('with engine and os set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.engine.set({
          name: 'WebKit',
        });
        main.os.set({
          name: 'Tizen',
          version: new Version({value: '2.0'}),
        });

        expect(main.toString()).to.be.equal('Tizen 2.0');

        done();
      });
    });

    describe('with browser', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });

        expect(main.toString()).to.be.equal('Chrome 47');

        done();
      });
    });

    describe('with browser, engine, os and device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Safari',
          version: new Version({value: '8.0'}),
        });
        main.engine.set({
          name: 'WebKit',
        });
        main.os.set({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });
        main.device.setIdentification({
          manufacturer: 'Apple',
          model: 'iPhone 6',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toString()).to.be.equal('Safari 8.0 on an Apple iPhone 6 running iOS 8.0');

        done();
      });
    });

    describe('with browser, os and unrecognized device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Chrome',
          version: new Version({value: '47.0.2526.73', details: 1}),
        });
        main.os.set({
          name: 'Android',
          version: new Version({value: '4.4'}),
        });
        main.device.set({
          model: 'SM-A300',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toString()).to.be.equal('Chrome 47 on an unrecognized device (SM-A300) running Android 4.4');

        done();
      });
    });

    describe('with unrecognized browser, and engine set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          stock: true,
        });
        main.engine.set({
          name: 'Blink',
        });

        expect(main.toString()).to.be.equal('an unknown browser based on Blink');

        done();
      });
    });

    describe('without browser but with engine and os and device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();


        main.engine.set({
          name: 'Blink',
        });
        main.os.set({
          name: 'OS X',
          version: new Version({value: '10.11', nickname: 'El Captain'}),
        });
        main.device.set({
          type: Constants.deviceType.DESKTOP,
        });

        expect(main.toString()).to.be.equal('an unknown browser based on Blink running on OS X El Captain 10.11');

        done();
      });
    });

    describe('with browser and device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Safari',
          version: new Version({value: '8.0'}),
        });

        main.device.setIdentification({
          manufacturer: 'Apple',
          model: 'iPhone 6',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toString()).to.be.equal('Safari 8.0 on an Apple iPhone 6');

        done();
      });
    });

    describe('with os and device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.os.set({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });

        main.device.setIdentification({
          manufacturer: 'Apple',
          model: 'iPhone 6',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toString()).to.be.equal('an Apple iPhone 6 running iOS 8.0');

        done();
      });
    });

    describe('with only device set', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.device.setIdentification({
          manufacturer: 'Apple',
          model: 'iPhone 6',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toString()).to.be.equal('an Apple iPhone 6');

        done();
      });
    });

    describe('with device set to television', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.TELEVISION,
        });

        expect(main.toString()).to.be.equal('a television');

        done();
      });
    });

    describe('with device set to emulator', () => {
      it('should return the complete string', (done) => {
        const main = new Main();

        main.device.setIdentification({
          type: Constants.deviceType.EMULATOR,
        });

        expect(main.toString()).to.be.equal('an emulator');

        done();
      });
    });
  });

  describe('test toObject method', () => {
      it('should match the returned object', (done) => {
        const main = new Main();

        main.browser.set({
          name: 'Safari',
          version: new Version({value: '8.0'}),
        });
        main.engine.set({
          name: 'WebKit',
        });
        main.os.set({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });
        main.device.setIdentification({
          manufacturer: 'Apple',
          model: 'iPhone 6',
          type: Constants.deviceType.MOBILE,
        });

        expect(main.toObject()).to.equal({
          browser: {
            name: 'Safari',
            version: '8.0',
          },
          engine: {
            name: 'WebKit',
          },
          os: {
            name: 'iOS',
            version: '8.0',
          },
          device: {
            type: 'mobile',
            manufacturer: 'Apple',
            model: 'iPhone 6',
          },
        });

        done();
      });
  });
});


