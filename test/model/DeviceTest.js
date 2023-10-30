const {describe, it} = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Device = require('../../src/model/Device');
const Constants = require('../../src/constants');

describe('Device Class', () => {
  describe('test defaults', () => {
    it('should be as expected', () => {
      const device = new Device();

      expect(device.generic).to.be.true();
      expect(device.identified).to.be.equal(Constants.id.NONE);
      expect(device.type).to.be.equal('');
      expect(device.subtype).to.be.equal('');
    });
  });

  describe('test empty', () => {
    it('should all be empty', () => {
      const device = new Device();

      expect(device.getManufacturer()).to.be.equal('');
      expect(device.getModel()).to.be.equal('');
      expect(device.getCarrier()).to.be.equal('');
    });
  });

  describe('test with properties', () => {
    it('should all be empty', () => {
      const device = new Device({model: 'Wii'});

      expect(device.getModel()).to.be.equal('Wii');
    });
  });

  describe('test set method', () => {
    it('should correctly set properties', () => {
      const device = new Device();

      device.set({model: 'Wii'});

      expect(device.getModel()).to.be.equal('Wii');
    });
  });

  describe('test setIdentification method', () => {
    it('should correctly set identification data', () => {
      const device = new Device();

      device.setIdentification({
        manufacturer: 'Microsoft',
        model: 'Xbox One',
      });

      expect(device.getManufacturer()).to.be.equal('Microsoft');
      expect(device.getModel()).to.be.equal('Xbox One');
      expect(device.generic).to.be.false();
    });
  });

  describe('test reset', () => {
    describe('without Defaults', () => {
      it('should reset to defaults', () => {
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
      });
    });

    describe('with Defaults', () => {
      it('should reset to defaults and apply defaults', () => {
        const device = new Device();

        device.setIdentification({model: 'Wii'});

        expect(device.getModel()).to.be.equal('Wii');
        expect(device.generic).to.be.false();

        device.reset({model: 'Xbox One'});

        expect(device.getModel()).to.be.equal('Xbox One');
        expect(device.generic).to.be.true();
      });
    });
  });

  describe('test setIdentification method', () => {
    describe('with model and no series', () => {
      it('should work', () => {
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
      });
    });

    describe('with series no model', () => {
      it('should return the series as model', () => {
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
      });
    });

    describe('with series and model', () => {
      it('should work', () => {
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
      });
    });

    describe('with carrier', () => {
      it('should work', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'NEC',
          model: 'N2002',
          carrier: 'DoCoMo',
        });

        expect(device.getCarrier()).to.be.equal('DoCoMo');
        expect(device.carrier).to.be.equal('DoCoMo');
        expect(device.generic).to.be.false();
      });
    });

    describe('with model but without calling setIdentification', () => {
      it('should not set the generic to false', () => {
        const device = new Device();

        device.set({
          manufacturer: 'Microsoft',
          model: 'Xbox One',
        });

        expect(device.getManufacturer()).to.be.equal('');
        expect(device.getModel()).to.be.equal('Xbox One');
        expect(device.generic).to.be.true();
      });
    });
  });

  describe('test toString method', () => {
    describe('with manufacturer and series property', () => {
      it('should return the manufacturer and series', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Kobo',
          series: 'eReader',
        });

        expect(device.toString()).to.be.equal('Kobo eReader');
      });
    });

    describe('with manufacturer and model property', () => {
      it('should return the manufacturer and model', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Nintendo',
          model: 'Wii',
        });

        expect(device.toString()).to.be.equal('Nintendo Wii');
      });
    });

    describe('with manufacturer, model and series property', () => {
      it('should return the manufacturer, model and series', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Sony',
          model: 'PRS-T2',
          series: 'Reader',
        });

        expect(device.toString()).to.be.equal('Sony PRS-T2 Reader');
      });
    });

    describe('with manufacturer and model that starts with the manufacturer', () => {
      it('should return only the model', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Apple',
          model: 'AppleTV',
        });

        expect(device.toString()).to.be.equal('AppleTV');
      });
    });

    describe('with manufacturer and model that are equal', () => {
      it('should return only the manufacturer', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'OUYA',
          model: 'OUYA',
        });

        expect(device.toString()).to.be.equal('OUYA');
      });
    });

    describe('with manufacturer and model but with hidden', () => {
      it('should return empty string', () => {
        const device = new Device();

        device.setIdentification({
          manufacturer: 'Apple',
          model: 'Macintosh',
          hidden: true,
        });

        expect(device.toString()).to.be.equal('');
      });
    });
  });

  describe('test isDetected method', () => {
    describe('with manufacturer and model', () => {
      it('should return that is detected', () => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          manufacturer: 'Microsoft',
          model: 'Xbox One',
        });
        expect(device.isDetected()).to.be.true();

        device.reset();

        expect(device.isDetected()).to.be.false();
      });
    });

    describe('with model', () => {
      it('should return that is detected', () => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          model: 'Xbox One',
        });
        expect(device.isDetected()).to.be.true();
      });
    });
    describe('with manufacturer', () => {
      it('should return that is detected', () => {
        const device = new Device();
        expect(device.isDetected()).to.be.false();

        device.set({
          manufacturer: 'Microsoft',
        });
        expect(device.isDetected()).to.be.true();
      });
    });
  });

  describe('test toObject method', () => {
    describe('with name manufacturer type and subtype', () => {
      it('should return an object with the four properties', () => {
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
      });
    });
    describe('with name manufacturer carrier type and subtype', () => {
      it('should return an object with the five properties', () => {
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
      });
    });
  });
});
