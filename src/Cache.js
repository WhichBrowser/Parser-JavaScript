const Analyser = require('./Analyser');
const Crypto = require('crypto');
const simpleCache = new Map();
let cacheCleanerInterval;
let actualCacheCheckInterval;

/**
 * Class that enable caching of results
 */
class Cache {
  /**
   * Analyse the provided headers or User-Agent string
   *
   * @param  {object|string}   headers   An object with all of the headers or a string with just the User-Agent header
   * @param  {object}          options   An object with configuration options
   * @param  {object}          that      An object that is the Parser this
   *
   * @return {boolean|object}        Returns true if the cache is active but no match found, return the match if found
   */
  static analyseWithCache(headers, options, that) {
    if (options.cache) {
      const Parser = require('./Parser');
      options.cacheExpires = options.cacheExpires <= 0 ? Number.MAX_SAFE_INTEGER : options.cacheExpires || 900;
      options.cacheCheckInterval = Math.max(options.cacheCheckInterval || parseInt(options.cacheExpires / 5, 10), 1);
      switch (options.cache) {
        case Parser.SIMPLE_CACHE: {
          /* Should set the clearCache interval only if cacheExpires is > 0 and it hasn't yet initializated
           or the cacheCheckInterval has changed */
          if (
            (!cacheCleanerInterval || actualCacheCheckInterval !== options.cacheCheckInterval) &&
            options.cacheExpires
          ) {
            clearInterval(cacheCleanerInterval);
            cacheCleanerInterval = setInterval(Cache.clearCache, options.cacheCheckInterval * 1000);
          }
          actualCacheCheckInterval = options.cacheCheckInterval;
          const cacheKey = Crypto.createHash('sha256').update(JSON.stringify(headers)).digest('hex');
          if (simpleCache.has(cacheKey)) {
            const hit = simpleCache.get(cacheKey);
            hit.expires = Cache.getExpirationTime(options);
            return hit.data;
          } else {
            const analyser = new Analyser(headers, options);
            analyser.setData(that);
            analyser.analyse();
            simpleCache.set(cacheKey, {
              data: {
                browser: that.browser,
                engine: that.engine,
                os: that.os,
                device: that.device,
                camouflage: that.camouflage,
                features: that.features,
              },
              expires: Cache.getExpirationTime(options),
            });
          }
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Check if data in cache is expired
   */
  static clearCache() {
    simpleCache.forEach((v, k) => {
      if (v.expires < +new Date()) {
        simpleCache.delete(k);
      }
    });
  }

  /**
   * Compute the expiration time
   *
   * @param  {object}          options   An object with configuration options
   *
   * @return {int}                       The expiration time timestamp
   */
  static getExpirationTime(options) {
    return options.cacheExpires === Number.MAX_SAFE_INTEGER
      ? Number.MAX_SAFE_INTEGER
      : +new Date() + options.cacheExpires * 1000;
  }

  /**
   * Reset the class state. Used only for test purpose
   */
  static resetClassState() {
    simpleCache.clear();
    clearInterval(cacheCleanerInterval);
    cacheCleanerInterval = null;
    actualCacheCheckInterval = null;
  }
}

module.exports = Cache;
