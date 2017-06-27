const {describe, it} = (exports.lab = require('Lab').script());
const expect = require('code').expect;
const Base = require('../../../src/model/primitive/Base');

describe('NameVersion Class', () => {
  describe('getName method', () => {
    it('should correctly handle name', (done) => {

      const nameVersion = new NammeVersione
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
