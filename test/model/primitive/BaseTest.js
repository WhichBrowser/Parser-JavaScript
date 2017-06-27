const {describe, it} = (exports.lab = require('Lab').script());
const expect = require('code').expect;
const Base = require('../../../src/model/primitive/Base');

describe('Base Class', () => {
  describe('constructor', () => {
    it('should create the class correctly', (done) => {
      expect(new Base({name: 'Generic'}).name).to.be.equal('Generic');
      done();
    });
  });

  describe('set method', () => {
    it('should set properties correctly', (done) => {
      const base = new Base();
      base.set({name: 'Generic'});
      expect(base.name).to.be.equal('Generic');
      done();
    });
  });
});
