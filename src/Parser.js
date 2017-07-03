const Main = require('./model/Main');
const Analyser = require('./Analyser');
/**
 * Class that parse the user-agent
 */
class Parser extends Main {
  /**
   * Create a new object that contains all the detected information
   *
   * @param  {object|string}   headers   Optional, an object with all of the headers or a string with just the User-Agent header
   * @param  {object}         options   Optional, an object with configuration options
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

    /* if (this.analyseWithCache(h, o)) {
     return;
     }*/

    const analyser = new Analyser(h, o);
    analyser.setData(this);
    analyser.analyse();
  }
}

module.exports = Parser;
