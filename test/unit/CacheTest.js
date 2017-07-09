const {describe, it, beforeEach, before, after} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Sinon = require('sinon');
const Parser = require('../../src/Parser');
const Cache = require('../../src/Cache');
const header1 = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)';
const header2 =
  'User-Agent: Mozilla/5.0 (Linux; Android 4.0.3;  GT-P3113 Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133  Safari/535.19';
const result1 = {
  browser: {name: 'Internet Explorer', version: '6.0', type: 'browser'},
  engine: {name: 'Trident'},
  os: {name: 'Windows', version: {value: '5.0', alias: '2000'}},
  device: {type: 'desktop'},
};
const result2 = {
  browser: {name: 'Chrome', version: '18', type: 'browser'},
  engine: {name: 'Webkit', version: '535.19'},
  os: {name: 'Android', version: '4.0.3'},
  device: {type: 'tablet', manufacturer: 'Samsung', model: 'Galaxy Tab 2 7.0'},
};
let clock;

describe('Cache Class', () => {
  beforeEach((done) => {
    Cache.purgeCache();
    done();
  });
  describe('Two subsequent parse with same UA', () => {
    it('should be cached', (done) => {
      let result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});

      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.not.exist();
      result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});
      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.be.true();

      done();
    });
  });

  describe('Two subsequent parse with different UA', () => {
    it('should not be cached', (done) => {
      let result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});

      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.not.exist();
      result = new Parser(header2, {cache: Parser.SIMPLE_CACHE});
      expect(result.toObject()).to.be.equal(result2);
      expect(result.cached).to.not.exist();
      done();
    });
  });

  before((done) => {
    clock = Sinon.useFakeTimers();
    done();
  });
  after((done) => {
    clock.restore();
    done();
  });
  describe('Default cache with default expiry time and expiry check timer', () => {
    it('should be empty after expiry time 900s + 1/5 * 900s + 1s', (done) => {
      let result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});

      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.not.exist();
      result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});
      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.be.true();
      clock.tick((900 + 10 + 900 / 5) * 1000);
      result = new Parser(header1, {cache: Parser.SIMPLE_CACHE});
      expect(result.toObject()).to.be.equal(result1);
      expect(result.cached).to.not.exist();

      done();
    });
  });

  describe('Creating Parse without arguments', () => {
    it('an calling analyse should work', (done) => {
      const parser = new Parser();
      parser.analyse('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)');

      expect(parser).to.be.instanceOf(Parser);

      expect(parser.isBrowser('Internet Explorer', '=', '6.0')).to.be.true();
      done();
    });
  });
});
