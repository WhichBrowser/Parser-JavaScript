const { describe, it, beforeEach, afterEach } = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Sinon = require('sinon');
const Parser = require('../../src/Parser');
const Cache = require('../../src/Cache');
const header1 = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)';
const header2 =
  'User-Agent: Mozilla/5.0 (Linux; Android 4.0.3;  GT-P3113 Build/IML74K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133  Safari/535.19';
const comparision1 = {
  browser: { name: 'Internet Explorer', version: '6.0', type: 'browser' },
  engine: { name: 'Trident' },
  os: { name: 'Windows', version: { value: '5.0', alias: '2000' } },
  device: { type: 'desktop' },
};
const comparision2 = {
  browser: { name: 'Chrome', version: '18', type: 'browser' },
  engine: { name: 'Webkit', version: '535.19' },
  os: { name: 'Android', version: '4.0.3' },
  device: { type: 'tablet', manufacturer: 'Samsung', model: 'Galaxy Tab 2 7.0' },
};
let clock;

describe('Cache Class', () => {
  beforeEach(() => {
    Cache.resetClassState();
    clock = Sinon.useFakeTimers({
      toFake: ['setInterval', 'clearInterval', 'Date'],
    });
  });
  afterEach(() => {
    clock.restore();
  });

  describe('Two subsequent parse with same UA', () => {
    it('should be cached', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();
    });
  });

  describe('Two subsequent parse with different UA', () => {
    it('should not be cached', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
      result = new Parser(header2, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision2);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Create cache with negative expiry time', () => {
    it('should let the Cache never expire', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: -1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // let pass 2 years
      clock.jump(60 * 60 * 24 * 265 * 2 * 1000);

      // it's still in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();
    });
  });

  describe('Create cache with an expiry time that would make the cache check interval be 0s (cacheExpires/5), ', () => {
    it('should instead be 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 4 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // let pass 3 seconds
      clock.tick(3 * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 4 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      // let pass 4 seconds + cache check inteval
      clock.tick((4 + 1 + 1) * 1000);

      // No more in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 4 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with default expiry time and expiry check timer', () => {
    it('should be empty after expiry time 900s + 1/5 * 900s + 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      clock.tick((900 + 900 / 5 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with default expiry time but with 1s expiry check timer', () => {
    it('should be empty after expiry time 900s + 1s + 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      clock.tick((900 + 1 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with 100s expiry time and default expiry check timer', () => {
    it('should be empty after expiry time 100s + 1/5 * 100s + 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      clock.tick((100 + 100 / 5 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with 100s expiry time but with 2s expiry check timer', () => {
    it('should be empty after expiry time 100s + 2s + 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      clock.tick((100 + 2 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with default expiry time but with 1s expiry check timer, one item with cache refreshed and one not', () => {
    it('the one refreshed should be in cache after the first expiry time (900 + 1 + 1), the other not', () => {
      // First call to Parser, cache both
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      let result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exist();

      // Second call, check that are cached
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.be.true();

      // Make the timer be 1 second before the cache expiry time
      clock.tick(899 * 1000);

      // Refresh only the record related to header 1
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      // Make the cache expiry and wait that the check interval has passed
      clock.tick(3 * 1000);

      // Call the parser with header1, it should be still in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      // Call the parser with header2, it should NOT be in cache
      result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });
      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exist();
    });
  });

  describe('Change the expiry time while cache is populated', () => {
    it('should affect only new items, and updated the expiry time after a new cache hit', () => {
      // First call to Parser, still not cached, expiry time default to 900s
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);

      expect(result.cached).to.not.exist();

      // let pass 200s
      clock.tick(200 * 1000);

      // Put in cache a new item with 100s expiry time
      let result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });

      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exist();

      // let expire the second item
      clock.tick((100 + 100 / 5 + 1) * 1000);

      result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });

      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exist();

      // First item is still in cache, parse it and update the expiry time
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      // Let expiry the first item.
      clock.tick((100 + 100 / 5 + 1) * 1000);

      // Item has expired also if the first 900s are not passed
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Parse UA with no expiry time', () => {
    it('should never expire', () => {
      // First call to Parser, still not cached, expiry time default to 900s
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 0 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // let pass 2 years
      clock.jump(60 * 60 * 24 * 265 * 2 * 1000);

      // it's still in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();
    });
  });

  describe('Enable cache expiry when cache has already some item inside with no expiry time,', () => {
    it('Old items are still there when the new expiry time come', () => {
      // First call to Parser, still not cached, expiry time default to 900s
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 0 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // let pass 2 years
      clock.jump(60 * 60 * 24 * 265 * 2 * 1000);

      // it's still in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 0 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      let result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE });
      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exist();

      // expiry the second record
      clock.tick((900 + 900 / 5 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE });
      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.not.exists();
    });
  });

  describe('Default cache with 100s expiry time but with 2s expiry check timer', () => {
    it('should be empty after expiry time 100s + 2s + 1s', () => {
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });

      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      clock.tick((100 + 2 + 1) * 1000);

      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE, cacheExpires: 100, cacheCheckInterval: 2 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });

  describe('Default cache with default expiry time and default check interval, after a second parse that change the check internval', () => {
    it('should correctly update the cache check loop', () => {
      // First call to Parser, cache both
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // Make the timer be 1 second before the cache expiry time
      clock.tick(899 * 1000);

      let result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE, cacheCheckInterval: 1 });

      // Let the cache expire for header 1 and let the cache check interval pass
      clock.tick((1 + 1 + 1) * 1000);

      // header 1 record should be gone, header 2 one shoul be there in cache
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      result2 = new Parser(header2, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      expect(result2.toObject()).to.be.equal(comparision2);
      expect(result2.cached).to.be.true();
    });
  });

  describe('Default cache with default expiry time and default check interval: second parse is done without cache', () => {
    it('the result returned should not come from cache', () => {
      // First call to Parser, cache both
      let result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();

      // let pass some time
      clock.tick(100 * 1000);

      // cache is populated with header1 record
      result = new Parser(header1, { cache: Parser.SIMPLE_CACHE });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.be.true();

      // parse the same header without cache property in options
      result = new Parser(header1, { cacheCheckInterval: 1 });
      expect(result.toObject()).to.be.equal(comparision1);
      expect(result.cached).to.not.exist();
    });
  });
});
