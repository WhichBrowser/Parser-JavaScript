const { describe, it } = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Base = require('../../../src/model/primitive/Base');

describe('Base Class', () => {
  describe('constructor', () => {
    it('should create the class correctly', () => {
      expect(new Base({ name: 'Generic' }).name).to.be.equal('Generic');
    });
  });

  describe('set method', () => {
    it('should set properties correctly', () => {
      const base = new Base();
      base.set({ name: 'Generic' });
      expect(base.name).to.be.equal('Generic');
    });
  });
});
