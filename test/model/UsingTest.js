const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Using = require('../../src/model/Using');
const Version = require('../../src/model/Version');

describe('Using Class', () => {
  describe('getName method', () => {
    it('should return the right name', (done) => {
      const using = new Using();
      expect(using.getName()).to.be.empty();

      using.reset({
        name: 'Crosswalk WebView',
        version: new Version({value: '11'}),
      });

      expect(using.getName()).to.be.equal('Crosswalk WebView');

      done();
    });
  });

  describe('getVersion method', () => {
    it('should return the right version', (done) => {
      const using = new Using();
      expect(using.getVersion()).to.be.empty();

      using.reset({
        name: 'Crosswalk WebView',
        version: new Version({value: '11'}),
      });

      expect(using.getVersion()).to.be.equal('11');

      done();
    });
  });

  describe('toString method', () => {
    it('should return the right version', (done) => {
      const using = new Using();
      expect(using.toString()).to.be.empty();

      using.reset({
        name: 'Crosswalk WebView',
        version: new Version({value: '11'}),
      });

      expect(using.toString()).to.be.equal('Crosswalk WebView 11');

      done();
    });
  });

  describe('toObject method', () => {
    describe('with name but not version defined', () => {
      it('should return the name as string', (done) => {
        const using = new Using();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Crosswalk WebView',
        });

        expect(using.toObject()).to.be.equal('Crosswalk WebView');

        done();
      });
    });

    describe('with name and version defined', () => {
      it('should return an object with both properties', (done) => {
        const using = new Using();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Crosswalk WebView',
          version: new Version({value: '17.12'}),
        });

        expect(using.toObject()).to.equal({
          name: 'Crosswalk WebView',
          version: '17.12',
        });

        done();
      });
    });

    describe('with name and complex version defined', () => {
      it('should return an object with both properties exploded', (done) => {
        const using = new Using();
        expect(using.toObject()).to.be.empty();

        using.reset({
          name: 'Crosswalk WebView',
          version: new Version({value: '17.12', details: 1, alias: 'Codename'}),
        });

        expect(using.toObject()).to.equal({
          name: 'Crosswalk WebView',
          version: {value: '17', alias: 'Codename'},
        });

        done();
      });
    });
  });
});
