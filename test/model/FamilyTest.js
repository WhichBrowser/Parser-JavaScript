const {describe, it} = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Family = require('../../src/model/Family');
const Version = require('../../src/model/Version');

describe('Family Class', () => {
  describe('getName method', () => {
    it('should return the right name', () => {
      const using = new Family();
      expect(using.getName()).to.be.empty();

      using.reset({
        name: 'Android',
        version: new Version({value: '4.1.1'}),
      });

      expect(using.getName()).to.be.equal('Android');
    });
  });

  describe('getVersion method', () => {
    it('should return the right version', () => {
      const using = new Family();
      expect(using.getVersion()).to.be.empty();

      using.reset({
        name: 'Android',
        version: new Version({value: '4.1.1'}),
      });

      expect(using.getVersion()).to.be.equal('4.1.1');
    });
  });

  describe('toString method', () => {
    it('should return the right version', () => {
      const using = new Family();
      expect(using.toString()).to.be.empty();

      using.reset({
        name: 'Android',
        version: new Version({value: '4.1.1'}),
      });

      expect(using.toString()).to.be.equal('Android 4.1.1');
    });
  });

  describe('toObject method', () => {
    describe('with name but not version defined', () => {
      it('should return the name as string', () => {
        const using = new Family();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Android',
        });

        expect(using.toObject()).to.be.equal('Android');
      });
    });

    describe('with name and version defined', () => {
      it('should return an object with both properties', () => {
        const using = new Family();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Android',
          version: new Version({value: '4.1.1'}),
        });

        expect(using.toObject()).to.equal({
          name: 'Android',
          version: '4.1.1',
        });
      });
    });

    describe('with name and complex version defined', () => {
      it('should return an object with both properties exploded', () => {
        const using = new Family();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Android',
          version: new Version({value: '4.1.1', details: 1, alias: 'Jelly Bean'}),
        });

        expect(using.toObject()).to.equal({
          name: 'Android',
          version: {value: '4', alias: 'Jelly Bean'},
        });
      });
    });
  });
});
