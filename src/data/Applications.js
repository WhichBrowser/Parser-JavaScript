/**
 * @typedef {object} BrowserAndOtherReturn
 * @property {object} browser
 * @property {object} device
 */
/**
 * @typedef {object} OtherReturn
 * @property {object} browser
 * @property {object} device
 */
const Browser = require('../model/Browser');
const Version = require('../model/Version');
/**
 * Applications utility
 *
 * @internal
 */
class Applications {
  /**
   *
   * @param {string} ua the User-Agent string
   *
   * @return {BrowserAndOtherReturn}
   */
  static identifyBrowser(ua = '') {
    if (ua.match(Applications.BROWSERS_REGEX)) {
      for (let type of Object.keys(Applications.BROWSERS)) {
        for (let item of Applications.BROWSERS[type]) {
          let match;
          if ((match = ua.match(item.regexp))) {
            return {
              browser: {
                name: item.name,
                hidden: item.hidden || false,
                stock: false,
                channel: '',
                type: type,
                version: match[1] ? new Version({
                  value: match[1],
                  details: item.details || null,
                }) : null,
              },
              device: typeof item.type !== 'undefined' ? {type: item.type} : null,
            };
          }
        }
      }
    }
  }

  /**
   *
   * @param {string} ua the User-Agent string
   *
   * @return {BrowserAndOtherReturn}
   */
  static identifyOther(ua = '') {
    if (ua.match(Applications.OTHERS_REGEX)) {
      for (let type of Object.keys(Applications.OTHERS)) {
        for (let item of Applications.OTHERS[type]) {
          let match;
          if ((match = ua.match(item.regexp))) {
            return {
              browser: {
                name: item.name,
                hidden: item.hidden || false,
                stock: false,
                channel: '',
                type: type,
                version: match[1] ? new Version({
                  value: match[1],
                  details: item.details || null,
                }) : null,
              },
              device: typeof item.type !== 'undefined' ? {type: item.type} : null,
            };
          }
        }
      }
    }
  }

  /**
   *
   * @param {string} ua the User-Agent string
   *
   * @return {Browser}
   */
  static identifyBot(ua = '') {
    if (ua.match(Applications.BOTS_REGEX)) {
      for (let type of Object.keys(Applications.BOTS)) {
        for (let item of Applications.BOTS[type]) {
          let match;
          if ((match = ua.match(item.regexp))) {
            return new Browser({
              name: item.name,
              stock: false,
              version: match[1] ? new Version({
                value: match[1],
                details: item.details || null,
              }) : null,
            });
          }
        }
      }
    }
  }
}

Applications.BOTS = require('../../data/applications-bots');
Applications.BOTS_REGEX = require('../../data/regexes/applications-bots');

Applications.BROWSERS = require('../../data/applications-browsers');
Applications.BROWSERS_REGEX = require('../../data/regexes/applications-browsers');

Applications.OTHERS = require('../../data/applications-others');
Applications.OTHERS_REGEX = require('../../data/regexes/applications-others');

module.exports = Applications;
