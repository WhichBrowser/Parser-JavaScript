const Main = require('./model/Main');
const Analyser = require('./Analyser');
const Cache = require('./Cache');

/**
 * Class that parse the user-agent
 */
class Parser extends Main {
  /**
   * Create a new object that contains all the detected information
   *
   * @param  {object|string}   headers   Optional, an object with all of the headers or a string with just the User-Agent header
   * @param  {object}          options   Optional, an object with configuration options
   * @param  {int}             [options.cacheExpires=900]   Expiry time in seconds
   * @param  {int}             [options.cacheCheckInterval=1/5 * options.cacheExpires] Time in seconds between each cache check to remove expired records. Minimum 1
   */
  constructor(headers = null, options = {}) {
    super();

    if (headers) {
      this.analyse(headers, options);
    }
  }

  /**
   * Analyse the provided headers or User-Agent string
   *
   * @param  {object|string}   headers   An object with all of the headers or a string with just the User-Agent header
   * @param  {object}         options   Optional, an object with configuration options
   */
  analyse(headers, options = {}) {
    let o = options;
    let h;
    if (typeof headers === 'string') {
      h = {'User-Agent': headers};
    } else if (headers['headers']) {
      h = headers['headers'];

      headers['headers'] = null;
      o = Object.assign({}, headers, options);
    } else {
      h = headers;
    }
    let data;
    if ((data = Cache.analyseWithCache(h, o, this))) {
      if (typeof data === 'object') {
        Object.assign(this, data);
        this.cached = true;
      }
      return;
    }

    const analyser = new Analyser(h, o);
    analyser.setData(this);
    analyser.analyse();
  }
}
Parser.SIMPLE_CACHE = 'simple';
module.exports = Parser;
