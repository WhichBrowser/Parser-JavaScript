const { describe, it } = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const NameVersion = require('../../../src/model/primitive/NameVersion');
const Version = require('../../../src/model/Version');

describe('NameVersion Class', () => {
  describe('getName method', () => {
    it('should correctly handle name', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.getName()).to.be.equal('');
    });

    it('should correctly reset name', () => {
      const nameVersion = new NameVersion();

      nameVersion.name = 'Test';
      nameVersion.reset({
        name: 'Generic',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.getName()).to.be.equal('Generic');
    });
    it('should correctly reset name and use alias', () => {
      const nameVersion = new NameVersion();

      nameVersion.name = 'Test';
      nameVersion.reset({
        name: 'Generic',
        alias: 'Alias',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.getName()).to.be.equal('Alias');
    });
  });

  describe('getVersion method', () => {
    it('should correctly handle version', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.getVersion()).to.be.equal('');

      nameVersion.reset({
        name: 'Generic',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.getVersion()).to.be.equal('1.0');
    });

    it('should correctly handle version and details', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.getVersion()).to.be.equal('');

      nameVersion.reset({
        name: 'Generic',
        version: new Version({ value: '1.0', details: 1 }),
      });

      expect(nameVersion.getVersion()).to.be.equal('1');
    });
  });

  describe('isDetected method', () => {
    it('should work as expected', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.isDetected()).to.be.false();

      nameVersion.reset({
        name: 'Generic',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.isDetected()).to.be.true();
    });
  });

  describe('toString method with only name', () => {
    it('should correctly handle name', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.toString()).to.be.equal('');

      nameVersion.reset({
        name: 'Generic',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.toString()).to.be.equal('Generic 1.0');
    });

    it('should correctly handle name and alias', () => {
      const nameVersion = new NameVersion();

      expect(nameVersion.toString()).to.be.equal('');

      nameVersion.reset({
        name: 'Generic',
        alias: 'Alias',
        version: new Version({ value: '1.0' }),
      });

      expect(nameVersion.toString()).to.be.equal('Alias 1.0');
    });
  });

  describe('identifyVersion method', () => {
    describe('with matching RegExp', () => {
      it('should find the version', () => {
        const nameVersion = new NameVersion();

        nameVersion.identifyVersion(/Version\/([0-9.]+)/u, 'Version/1.0');
        expect(nameVersion.getVersion()).to.be.equal('1.0');

        nameVersion.reset();
        expect(nameVersion.getVersion()).to.be.equal('');
      });
    });

    describe('with not matching RegExp', () => {
      it('should not find the version', () => {
        const nameVersion = new NameVersion();

        nameVersion.identifyVersion(/Version\/([0-9.]+)/u, 'Other/1.0');
        expect(nameVersion.getVersion()).to.be.equal('');
      });
    });

    describe('with matching RegExp and details', () => {
      it('should find the version and truncate it according to details', () => {
        const nameVersion = new NameVersion();

        nameVersion.identifyVersion(/Version\/([0-9.]+)/u, 'Version/1.0', { details: 1 });
        expect(nameVersion.getVersion()).to.be.equal('1');
      });
    });

    describe('with matching RegExp and with underscore', () => {
      it('should find the version and replace underscores', () => {
        const nameVersion = new NameVersion();

        nameVersion.identifyVersion(/Version\/([0-9.]+)/u, 'Version/1_0_2', { type: 'underscore' });
        expect(nameVersion.getVersion()).to.be.equal('1');
      });
    });

    describe('with matching RegExp and with legacy type', () => {
      it('should find the version and transform it from legacy', () => {
        const nameVersion = new NameVersion();

        nameVersion.identifyVersion(/Version\/([0-9.]+)/u, 'Version/1.02', { type: 'legacy' });
        expect(nameVersion.getVersion()).to.be.equal('1.0.2');
      });
    });
  });
});
