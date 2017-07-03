const Main = require('./model/Main');
const Constants = require('./constants');
const Header = require('./analyser/Header');
/**
 * Class that parse the user-agent
 */
class Analyser {
  /**
   * Create a Analyser instance
   *
   * @param  {object}   headers   An object with all of the headers or a string with just the User-Agent header
   * @param  {object}         options   Optional, an object with configuration options
   */
  constructor(headers, options = {}) {
    this.headers = headers;
    this.options = options;
  }

  /**
   * set data to data property
   *
   * @param  {object}   data
   */
  setData(data) {
    this.data = data;
  }

  /**
   * return data from data property
   *
   * @return  {object}  data
   */
  getData() {
    return this.data;
  }

  /**
   * Analyse the provided headers or User-Agent string
   *
   */
  analyse() {
    if (!this.data) {
      // TODO should not work
      this.data = new Main();
    }
    Headers.analyseHeaders.call(this);
    // return this.data;
  }
}
