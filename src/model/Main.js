/* eslint-disable valid-jsdoc */
const Browser = require('./Browser');
const Engine = require('./Engine');
const Os = require('./Os');
const Device = require('./Device');
const Constants = require('../constants');

/**
 * Main class
 */
class Main {
  /**
   * Create default objects
   */
  constructor() {
    this.browser = new Browser();
    this.engine = new Engine();
    this.os = new Os();
    this.device = new Device();
    this.camouflage = false;
    this.features = [];
  }

  /**
   * Check the name of a property and optionally is a specific version
   *
   * @internal
   *
   * @param  {...*} args arguments array
   * @param  {string} args[0]  The name of the property, such as 'browser', 'engine' or 'os'
   * @param  {string} args[1]  The name of the browser that is checked
   * @param  {string} [args[2]]  Optional, the operator, must be <, <=, =, >= or >
   * @param  {number|float|string} [args[3]]   Optional, the value, can be an integer, float or string with a version
   *                                          number
   *
   * @return {boolean}
   */
  isX(...args) {
    const x = args[0];

    if (args.length < 2) {
      return false;
    }

    if (!this[x].name) {
      return false;
    }

    if (this[x].name !== args[1]) {
      return false;
    }

    if (args.length >= 4) {
      if (typeof this[x].version === 'undefined' || this[x].version === null) {
        return false;
      }

      if (!this[x].version.is(args[2], args[3])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check the name of the browser and optionally is a specific version
   *
   * @param  {...*} args   arguments array
   * @param  {string} args[0]   The name of the browser that is checked
   * @param  {string}  [args[1]] Optional, the operator, must be <, <=, =, >= or >
   * @param  {number|float|string} [args[2]] Optional, the value, can be an integer, float or string with a version
   *                                         number
   *
   * @return boolean
   */
  isBrowser(...args) {
    args.unshift('browser');
    return this.isX(...args);
  }

  /**
   * @param  {...*} args   arguments array
   * @param  {string} args[0]   The name of the rendering engine that is checked
   * @param  {string}  [args[1]] Optional, the operator, must be <, <=, =, >= or >
   * @param  {number|float|string}  [args[2]] Optional, the value, can be an integer, float or string with a version number
   *
   * @return boolean
   */
  isEngine(...args) {
    args.unshift('engine');
    return this.isX(...args);
  }

  /**
   * @param  {list} args   arguments array
   * @param  {string} args[0]   The name of the operating system that is checked
   * @param  {string}  [args[1]] Optional, the operator, must be <, <=, =, >= or >
   * @param  {number|float|string}  [args[2]] Optional, the value, can be an integer, float or string with a version number
   *
   * @return boolean
   */
  isOs(...args) {
    args.unshift('os');
    return this.isX(...args);
  }

  /**
   * Check if the detected browser is of the specified type
   *
   * @param  {string}  model  The type, or a combination of type and subtype joined with a semicolon.
   *
   * @return {boolean}
   */
  isDevice(model) {
    return (
      (this.device.series && this.device.series === model) || (this.device.model && this.device.model === model)
    );
  }

  /**
   * Get the type and subtype, separated by a semicolon (if applicable)
   *
   * @return {string}
   */
  getType() {
    return `${this.device.type}${this.device.subtype ? `:${this.device.subtype}` : ''}`;
  }

  /**
   * Check if the detected browser is of the specified type
   *
   * @param  {...string} args function arguments
   * @param  {string} args[0]  The type, or a combination of type and subtype joined with a semicolon.
   * @param  {string} args[1-inf]  Unlimited optional types, or a combination of type and subtype joined with a
   *                               semicolon to check
   *
   * @return {boolean}
   */
  isType(...args) {
    for (let i = 0; i < args.length; i++) {
      if (args[i].includes(':')) {
        const [type, subtype] = args[i].split(':');
        if (type === this.device.type && subtype === this.device.subtype) {
          return true;
        }
      } else {
        if (args[i] === this.device.type) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the detected browser is a mobile device
   *
   * @return {boolean}
   */
  isMobile() {
    return this.isType(
      Constants.deviceType.MOBILE,
      Constants.deviceType.TABLET,
      Constants.deviceType.EREADER,
      Constants.deviceType.MEDIA,
      Constants.deviceType.WATCH,
      Constants.deviceType.CAMERA,
      `${Constants.deviceType.GAMING}:${Constants.deviceSubType.PORTABLE}`
    );
  }

  /**
   * Check if a browser was detected
   *
   * @return {boolean}
   */
  isDetected() {
    return this.browser.isDetected() || this.os.isDetected() || this.engine.isDetected() || this.device.isDetected();
  }

  /**
   * Return the input string prefixed with 'a' or 'an' depending on the first letter of the string
   *
   * @internal
   *
   * @param  {string}   str      The string that will be prefixed
   *
   * @return {string}
   */
  static a(str) {
    return `${/^[aeiou]/i.test(str) ? 'an ' : 'a '}${str}`;
  }

  /**
   * Get a human readable string of the whole browser identification
   *
   * @return {string}
   */
  toString() {
    const prefix = this.camouflage ? 'an unknown browser that imitates ' : '';
    const browser = this.browser.toString();
    const os = this.os.toString();
    const engine = this.engine.toString();
    let device = this.device.toString();

    if (!device && !os && this.device.type === 'television') {
      device = 'television';
    }

    if (!device && this.device.type === 'emulator') {
      device = 'emulator';
    }

    if (browser && os && device) {
      return `${prefix}${browser} on ${Main.a(device)} running ${os}`;
    }

    if (browser && !os && device) {
      return `${prefix}${browser} on ${Main.a(device)}`;
    }

    if (browser && os && !device) {
      return `${prefix}${browser} on ${os}`;
    }

    if (!browser && os && device) {
      return `${prefix}${Main.a(device)} running ${os}`;
    }

    if (browser && !os && !device) {
      return `${prefix}${browser}`;
    }

    if (!browser && !os && device) {
      return `${prefix}${Main.a(device)}`;
    }

    if (this.device.type === 'desktop' && os && engine && !device) {
      return `an unknown browser based on ${engine} running on ${os}`;
    }

    if (this.browser.stock && os && !device) {
      return os;
    }

    if (this.browser.stock && engine && !device) {
      return `an unknown browser based on ${engine}`;
    }

    if (this.device.type === 'bot') {
      return 'an unknown bot';
    }

    return 'an unknown browser';
  }

  /**
   * Get an object of all defined properties
   *
   * @return {object}
   */
  toObject() {
    const properties = ['browser', 'engine', 'os', 'device'];

    const result = properties.reduce((acc, value) => {
      const temp = this[value].toObject();
      if (Object.keys(temp).length) {
        acc[value] = temp;
      }
      return acc;
    }, {});

    if (this.camouflage) {
      result.camouflage = true;
    }

    return result;
  }
}

/* eslint-enable valid-jsdoc */

module.exports = Main;
