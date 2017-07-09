const Analyser = require('./Analyser');
const Crypto = require('crypto');
const simpleCache = new Map();
let cacheCleanerInterval;

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
      options.cacheExpires = options.cacheExpires || 900;
      options.cacheCheckInterval = options.cacheCheckInterval || parseInt(options.cacheExpires / 5, 10);
      switch (options.cache) {
        case Parser.SIMPLE_CACHE: {
          if (!cacheCleanerInterval && options.cacheExpires) {
            cacheCleanerInterval = setInterval(Cache.clearCache, options.cacheCheckInterval * 1000);
          }
          const chiper = Crypto.createHash('sha256').update(JSON.stringify(headers)).digest('hex');
          if (simpleCache.has(chiper)) {
            const hit = simpleCache.get(chiper);
            hit.expires = Cache.getExpirationValue(options);
            return hit.data;
          } else {
            const analyser = new Analyser(headers, options);
            analyser.setData(that);
            analyser.analyse();
            simpleCache.set(chiper, {
              data: {
                browser: that.browser,
                engine: that.engine,
                os: that.os,
                device: that.device,
                camouflage: that.camouflage,
                features: that.features,
              },
              expires: Cache.getExpirationValue(options),
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
   * @return {int}                       The expiration time
   */
  static getExpirationValue(options) {
    return +new Date() + options.cacheExpires * 1000;
  }

  /**
   * Clear the cached. Used only for test purpose
   */
  static purgeCache() {
    simpleCache.clear();
  }
}

module.exports = Cache;
