const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Device = require('../../src/model/Device');
const Constants = require('../../src/constants');

describe('Device Class', () => {
  describe('test defaults', () => {
    it('should be as expected', (done) => {
      const device = new Device();

      expect(device.generic).to.be.true();
      expect(device.identified).to.be.equal(Constants.id.NONE);
      expect(device.type).to.be.equal('');
      expect(device.subtype).to.be.equal('');

      done();
    });
  });

  describe('test empty', () => {
    it('should all be empty', (done) => {
      const device = new Device();

      expect(device.getManufacturer()).to.be.equal('');
      expect(device.getModel()).to.be.equal('');
      expect(device.getCarrier()).to.be.equal('');

      done();
    });
  });

  describe('test with properties', () => {
    it('should all be empty', (done) => {
      const device = new Device({model: 'Wii'});

      expect(device.getModel()).to.be.equal('Wii');

      done();
    });
  });

  describe('test set method', () => {
    it('should correctly set properties', (done) => {
      const device = new Device();

      device.set({model: 'Wii'});

      expect(device.getModel()).to.be.equal('Wii');

      done();
    });
  });

  describe('test setIdentification method', () => {
    it('should correctly set identification data', (done) => {
      const device = new Device();

      device.setIdentification({
        manufacturer: 'Microsoft',
        model: 'Xbox One',
      });

      expect(device.getManufacturer()).to.be.equal('Microsoft');
      expect(device.getModel()).to.be.equal('Xbox One');
      expect(device.generic).to.be.false();

      done();
    });
  });

  describe('test reset', () => {
    describe('without Defaults', () => {
      it('should reset to defaults', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Nintendo',
          model: 'Wii',
        });

        expect(device.getManufacturer()).to.be.equal('Nintendo');
        expect(device.getModel()).to.be.equal('Wii');
        expect(device.generic).to.be.false();

        device.reset();

        expect(device.getManufacturer()).to.be.equal('');
        expect(device.getModel()).to.be.equal('');
        expect(device.generic).to.be.true();
        expect(device.identified).to.be.equal(Constants.id.NONE);
        expect(device.type).to.be.equal('');
        expect(device.subtype).to.be.equal('');

        done();
      });
    });

    describe('with Defaults', () => {
      it('should reset to defaults and apply defaults', (done) => {
        const device = new Device();

        device.setIdentification({model: 'Wii'});

        expect(device.getModel()).to.be.equal('Wii');
        expect(device.generic).to.be.false();

        device.reset({model: 'Xbox One'});

        expect(device.getModel()).to.be.equal('Xbox One');
        expect(device.generic).to.be.true();

        done();
      });
    });
  });

  describe('test setIdentification method', () => {
    describe('with model and no series', () => {
      it('should work', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Nintendo',
          model: 'Wii',
        });

        expect(device.getManufacturer()).to.be.equal('Nintendo');
        expect(device.getModel()).to.be.equal('Wii');

        expect(device.manufacturer).to.be.equal('Nintendo');
        expect(device.model).to.be.equal('Wii');
        expect(device.generic).to.be.false();

        done();
      });
    });

    describe('with series no model', () => {
      it('should return the series as model', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Kobo',
          series: 'eReader',
        });

        expect(device.getManufacturer()).to.be.equal('Kobo');
        expect(device.getModel()).to.be.equal('eReader');

        expect(device.manufacturer).to.be.equal('Kobo');
        expect(device.series).to.be.equal('eReader');
        expect(device.generic).to.be.true();

        done();
      });
    });

    describe('with series and model', () => {
      it('should work', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Sony',
          model: 'PRS-T2',
          series: 'Reader',
        });

        expect(device.getManufacturer()).to.be.equal('Sony');
        expect(device.getModel()).to.be.equal('PRS-T2 Reader');

        expect(device.manufacturer).to.be.equal('Sony');
        expect(device.model).to.be.equal('PRS-T2');
        expect(device.series).to.be.equal('Reader');
        expect(device.generic).to.be.false();

        done();
      });
    });

    describe('with carrier', () => {
      it('should work', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'NEC',
          model: 'N2002',
          carrier: 'DoCoMo',
        });

        expect(device.getCarrier()).to.be.equal('DoCoMo');
        expect(device.carrier).to.be.equal('DoCoMo');
        expect(device.generic).to.be.false();

        done();
      });
    });

    describe('with model but without calling setIdentification', () => {
      it('should not set the generic to false', (done) => {
        const device = new Device();

        device.set({
          manufacturer: 'Microsoft',
          model: 'Xbox One',
        });

        expect(device.getManufacturer()).to.be.equal('');
        expect(device.getModel()).to.be.equal('Xbox One');
        expect(device.generic).to.be.true();

        done();
      });
    });
  });

  describe('test toString method', () => {
    describe('with manufacturer and series property', () => {
      it('should return the manufacturer and series', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Kobo',
          series: 'eReader',
        });

        expect(device.toString()).to.be.equal('Kobo eReader');

        done();
      });
    });

    describe('with manufacturer and model property', () => {
      it('should return the manufacturer and model', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Nintendo',
          model: 'Wii',
        });

        expect(device.toString()).to.be.equal('Nintendo Wii');

        done();
      });
    });

    describe('with manufacturer, model and series property', () => {
      it('should return the manufacturer, model and series', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Sony',
          model: 'PRS-T2',
          series: 'Reader',
        });

        expect(device.toString()).to.be.equal('Sony PRS-T2 Reader');

        done();
      });
    });

    describe('with manufacturer and model that starts with the manufacturer', () => {
      it('should return only the model', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Apple',
          model: 'AppleTV',
        });

        expect(device.toString()).to.be.equal('AppleTV');

        done();
      });
    });

    describe('with manufacturer and model that are equal', () => {
      it('should return only the manufacturer', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'OUYA',
          model: 'OUYA',
        });

        expect(device.toString()).to.be.equal('OUYA');

        done();
      });
    });

    describe('with manufacturer and model but with hidden', () => {
      it('should return empty string', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Apple',
          model: 'Macintosh',
          hidden: true,
        });

        expect(device.toString()).to.be.equal('');

        done();
      });
    });
  });

  describe('test isDetected method', () => {
    describe('with manufacturer and model', () => {
      it('should return that is detected', (done) => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          manufacturer: 'Microsoft',
          model: 'Xbox One',
        });
        expect(device.isDetected()).to.be.true();

        device.reset();

        expect(device.isDetected()).to.be.false();

        done();
      });
    });

    describe('with model', () => {
      it('should return that is detected', (done) => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          model: 'Xbox One',
        });
        expect(device.isDetected()).to.be.true();

        done();
      });
    });
    describe('with manufacturer', () => {
      it('should return that is detected', (done) => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          manufacturer: 'Microsoft',
        });
        expect(device.isDetected()).to.be.true();

        done();
      });
    });
  });

  describe('test toObject method', () => {
    describe('with name manufacturer type and subtype', () => {
      it('should return an object with the four properties', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Sony',
          model: 'PlayStation 4',
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });

        expect(device.toObject()).equal({
          manufacturer: 'Sony',
          model: 'PlayStation 4',
          type: Constants.deviceType.GAMING,
          subtype: Constants.deviceSubType.CONSOLE,
        });
        done();
      });
    });
    describe('with name manufacturer carrier type and subtype', () => {
      it('should return an object with the five properties', (done) => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'NEC',
          model: 'N2002',
          carrier: 'DoCoMo',
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.FEATURE,
        });

        expect(device.toObject()).equal({
          manufacturer: 'NEC',
          model: 'N2002',
          carrier: 'DoCoMo',
          type: Constants.deviceType.MOBILE,
          subtype: Constants.deviceSubType.FEATURE,
        });
        done();
      });
    });
  });
});
