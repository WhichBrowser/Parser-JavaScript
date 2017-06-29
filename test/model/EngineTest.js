const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Engine = require('../../src/model/Engine');
const Version = require('../../src/model/Version');

describe('Engine Class', () => {
  describe('getName method', () => {
    describe('without alias', () => {
      it('should return the right name', (done) => {
        const engine = new Engine();
        expect(engine.getName()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.getName()).to.be.equal('WebKit');

        done();
      });
    });

    describe('with alias', () => {
      it('should return the alias', (done) => {
        const engine = new Engine();
        expect(engine.getName()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          alias: 'Blink',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.getName()).to.be.equal('Blink');

        done();
      });
    });
  });

  describe('getVersion method', () => {
    describe('without details property', () => {
      it('should return the entire version', (done) => {
        const engine = new Engine();
        expect(engine.getVersion()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.getVersion()).to.be.equal('601.3.9');

        done();
      });
    });

    describe('with details property', () => {
      it('should return the truncated version number', (done) => {
        const engine = new Engine();
        expect(engine.getVersion()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9', details: 1}),
        });

        expect(engine.getVersion()).to.be.equal('601');

        done();
      });
    });
  });

  describe('isDetected method', () => {
    it('should return the right version', (done) => {
      const engine = new Engine();
      expect(engine.isDetected()).to.be.false();

      engine.reset({
        name: 'WebKit',
        version: new Version({value: '601.3.9'}),
      });

      expect(engine.isDetected()).to.be.true();

      done();
    });
  });

  describe('toString method', () => {
    describe('without alias property', () => {
      it('should return the name and version', (done) => {
        const engine = new Engine();
        expect(engine.toString()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.toString()).to.be.equal('WebKit 601.3.9');

        done();
      });
    });

    describe('with alias property', () => {
      it('should return the alias and version', (done) => {
        const engine = new Engine();
        expect(engine.toString()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          alias: 'Blink',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.toString()).to.be.equal('Blink 601.3.9');

        done();
      });
    });
  });

  describe('identifyVersion method', () => {
    describe('with matching RegExp', () => {
      it('should return the correct version', (done) => {
        const engine = new Engine();

        engine.identifyVersion(/AppleWebKit\/([0-9.]+)/u, 'AppleWebKit/601.3.9');

        expect(engine.getVersion()).to.be.equal('601.3.9');

        done();
      });
    });

    describe('with not matching RegExp', () => {
      it('should return empty version', (done) => {
        const engine = new Engine();

        engine.identifyVersion(/AppleWebKit\/([0-9.]+)/u, 'Gecko/19.0');

        expect(engine.getVersion()).to.be.empty();

        done();
      });
    });

    describe('with matching RegExp and details property', () => {
      it('should return the truncated version', (done) => {
        const engine = new Engine();

        engine.identifyVersion(/AppleWebKit\/([0-9.]+)/u, 'AppleWebKit/601.3.9', {details: 1});

        expect(engine.getVersion()).to.be.equal('601');

        done();
      });
    });
  });

  describe('toObject method', () => {
    describe('with name but not version defined', () => {
      it('should return the name as string', (done) => {
        const engine = new Engine();
        expect(engine.toObject()).to.be.empty();

        engine.set({
          name: 'Test',
        });

        expect(engine.toObject()).to.equal({name: 'Test'});

        done();
      });
    });

    describe('with name but not version defined', () => {
      it('should return the name as string', (done) => {
        const engine = new Engine();
        expect(engine.toObject()).to.be.empty();

        engine.set({
          name: null,
        });

        expect(engine.toObject()).to.be.empty();

        done();
      });
    });

    describe('with name and version defined', () => {
      it('should return an object with both properties', (done) => {
        const engine = new Engine();
        expect(engine.toObject()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9'}),
        });

        expect(engine.toObject()).to.equal({
          name: 'WebKit',
          version: '601.3.9',
        });

        done();
      });
    });

    describe('with name and complex version defined', () => {
      it('should return an object with both properties exploded', (done) => {
        const engine = new Engine();
        expect(engine.toObject()).to.be.empty();

        engine.reset({
          name: 'WebKit',
          version: new Version({value: '601.3.9', details: 1, alias: 'TestVersion'}),
        });

        expect(engine.toObject()).to.equal({
          name: 'WebKit',
          version: {value: '601', alias: 'TestVersion'},
        });

        done();
      });
    });
  });
});
