const Device = require('../model/Device');
const Constants = require('../constants');
/**
 * DeviceModels utility
 *
 * @internal
 */
class DeviceModels {
  /**
   *
   * @param {string} type
   * @param {string} model
   *
   * @return {Device}
   */
  static identify(type, model) {
    const modelsName = `${type.toUpperCase()}_MODELS`;
    DeviceModels[modelsName] = require(`../../data/models-${type}`)[modelsName];
    if (type !== 'blackberry' && type !== 'ios') {
      const indicesName = `${type.toUpperCase()}_INDEX`;
      DeviceModels[indicesName] = require(`../../data/indices/models-${type}`)[indicesName];
    }
    switch (type) {
      case 'android':
        return DeviceModels.identifyAndroid(model);
      case 'asha':
        return DeviceModels.identifyList(DeviceModels.ASHA_INDEX, DeviceModels.ASHA_MODELS, model);
      case 'bada':
        return DeviceModels.identifyList(DeviceModels.BADA_INDEX, DeviceModels.BADA_MODELS, model);
      case 'blackberry':
        return DeviceModels.identifyBlackBerry(model);
      case 'brew':
        return DeviceModels.identifyList(DeviceModels.BREW_INDEX, DeviceModels.BREW_MODELS, model);
      case 'firefoxos':
        return DeviceModels.identifyList(DeviceModels.FIREFOXOS_INDEX, DeviceModels.FIREFOXOS_MODELS, model, false);
      case 'ios':
        return DeviceModels.identifyIOS(model);
      case 'tizen':
        return DeviceModels.identifyList(DeviceModels.TIZEN_INDEX, DeviceModels.TIZEN_MODELS, model);
      case 'touchwiz':
        return DeviceModels.identifyList(DeviceModels.TOUCHWIZ_INDEX, DeviceModels.TOUCHWIZ_MODELS, model);
      case 'wm':
        return DeviceModels.identifyWindowsMobile(model);
      case 'wp':
        return DeviceModels.identifyList(DeviceModels.WP_INDEX, DeviceModels.WP_MODELS, model);
      case 's30plus':
        return DeviceModels.identifyList(DeviceModels.S30PLUS_INDEX, DeviceModels.S30PLUS_MODELS, model);
      case 's40':
        return DeviceModels.identifyList(DeviceModels.S40_INDEX, DeviceModels.S40_MODELS, model);
      case 'symbian':
        return DeviceModels.identifyList(DeviceModels.SYMBIAN_INDEX, DeviceModels.SYMBIAN_MODELS, model);
      case 'palmos':
        return DeviceModels.identifyList(DeviceModels.PALMOS_INDEX, DeviceModels.PALMOS_MODELS, model);
      case 'kddi':
        return DeviceModels.identifyList(DeviceModels.KDDI_INDEX, DeviceModels.KDDI_MODELS, model);
    }

    DeviceModels.FEATURE_MODELS = require('../../data/models-feature').FEATURE_MODELS;
    DeviceModels.FEATURE_INDEX = require('../../data/indices/models-feature').FEATURE_INDEX;
    return DeviceModels.identifyList(DeviceModels.FEATURE_INDEX, DeviceModels.FEATURE_MODELS, model);
  }

  /**
   *
   * @param {string} model
   *
   * @return {Device}
   */
  static identifyWindowsMobile(model) {
    model = model.replace(/^(HTC|SAMSUNG|SHARP|Toshiba)\//u, '');
    return DeviceModels.identifyList(DeviceModels.WM_INDEX, DeviceModels.WM_MODELS, model);
  }

  /**
   *
   * @param {string} model
   *
   * @return {Device}
   */
  static identifyIOS(model) {
    const original = model;
    model = model.replace('Unknown ', '');
    model = model.replace(/iPh([0-9],[0-9])/, 'iPhone$1');
    model = model.replace(/iPd([0-9],[0-9])/, 'iPod$1');
    const device = new Device({
      type: Constants.deviceType.MOBILE,
      identified: Constants.id.NONE,
      manufacturer: null,
      model: model,
      identifier: original,
      generic: false,
    });
    if (DeviceModels.IOS_MODELS[model]) {
      const match = DeviceModels.IOS_MODELS[model];
      device.manufacturer = match[0];
      device.model = match[1];
      device.identified = Constants.id.MATCH_UA;
      if (isDefined(match[2]) || isDefined(match['type'])) {
        device.type = isDefined(match[2]) ? match[2] : match['type'];
      }
      return device;
    }
    return device;
  }

  /**
   *
   * @param {string} model
   *
   * @return {Device}
   */
  static identifyBlackBerry(model) {
    const original = model;
    let match;
    if ((match = model.match(/BlackBerry ?([0-9]+)/iu))) {
      model = match[1];
    }
    const device = new Device({
      type: Constants.deviceType.MOBILE,
      identified: Constants.id.NONE,
      manufacturer: null,
      model: model,
      identifier: original,
      generic: false,
    });
    if (/^[1-9][0-9][0-9][0-9][ei]?$/u.test(model)) {
      device.manufacturer = 'RIM';
      device.model = `BlackBerry ${model}`;
      device.identified = Constants.id.PATTERN;
      if (DeviceModels.BLACKBERRY_MODELS[model]) {
        device.model = `BlackBerry ${DeviceModels.BLACKBERRY_MODELS[model]} ${model}`;
        device.identified = Constants.id.MATCH_UA;
      }
    }
    return device;
  }

  /**
   *
   * @param {string} model
   *
   * @return {Device}
   */
  static identifyAndroid(model) {
    const result = DeviceModels.identifyList(DeviceModels.ANDROID_INDEX, DeviceModels.ANDROID_MODELS, model);
    if (!result.identified) {
      model = DeviceModels.cleanup(model);
      if (
        /AndroVM/iu.test(model) ||
        model === 'Emulator' ||
        model === 'x86 Emulator' ||
        model === 'x86 VirtualBox' ||
        model === 'vm'
      ) {
        return new Device({
          type: Constants.deviceType.EMULATOR,
          identified: Constants.id.PATTERN,
          manufacturer: null,
          model: null,
          generic: false,
        });
      }
    }
    return result;
  }

  /**
   *
   * @param {object} index
   * @param {object} list
   * @param {string} model
   * @param {boolean} cleanup
   *
   * @return {Device}
   */
  static identifyList(index, list, model, cleanup = true) {
    const original = model;
    if (cleanup) {
      model = DeviceModels.cleanup(model);
    }
    const device = new Device({
      type: Constants.deviceType.MOBILE,
      identified: Constants.id.NONE,
      manufacturer: null,
      model: model,
      identifier: original,
      generic: false,
    });
    const keys = [`@${model.substring(0, 2).toUpperCase()}`, '@'];
    let pattern = null;
    let match = null;
    for (let key of keys) {
      if (index[key]) {
        for (let v of index[key]) {
          const originalV = v;
          v = DeviceModels.cleanUpPattern(v);
          if (DeviceModels.hasMatch(v, model)) {
            if (v) {
              if (v.endsWith('!!')) {
                if (!list[v]) {
                  if (!list[originalV]) {
                    if (list[DeviceModels.getKey(v)]) {
                      v = DeviceModels.getKey(v);
                    } else if (list[DeviceModels.getKey(originalV)]) {
                      v = DeviceModels.getKey(originalV);
                    }
                  }
                }

                for (let m2 of Object.keys(list[v] || list[originalV])) {
                  const v2 = (list[v] || list[originalV])[m2];
                  if (DeviceModels.hasMatch(m2, model)) {
                    match = v2;
                    pattern = m2;
                    break;
                  }
                }
              } else {
                match =
                  list[v] || list[originalV] || list[DeviceModels.getKey(v)] || list[DeviceModels.getKey(originalV)];
                pattern = v;
              }
            }
            if (match) {
              match = match.reduce((acc, item, index) => {
                if (!!item && typeof item === 'object' && !Array.isArray(item)) {
                  Object.keys(item).forEach((key) => (acc[key] = item[key]));
                } else {
                  acc[index] = item;
                }
                return acc;
              }, {});
              device.manufacturer = match[0];
              device.model = DeviceModels.applyMatches(match[1], model, pattern);
              device.identified = Constants.id.MATCH_UA;
              if (isDefined(match[2]) || isDefined(match['type'])) {
                const type = isDefined(match[2]) ? match[2] : match['type'];
                if (Array.isArray(type)) {
                  device.type = type[0];
                  device.subtype = type[1];
                } else {
                  device.type = type;
                }
              }
              if (isDefined(match[3]) || isDefined(match['flag'])) {
                device.flag = isDefined(match[3]) ? match[3] : match['flag'];
              }
              if (isDefined(match['carrier'])) {
                device.carrier = match['carrier'];
              }
              if (device.manufacturer === null && device.model === null) {
                device.identified = Constants.id.PATTERN;
              }
              return device;
            }
          }
        }
      }
    }
    return device;
  }

  /**
   *
   * @param {string} model
   * @param {string} original
   * @param {string} pattern
   *
   * @return {string}
   */
  static applyMatches(model, original, pattern) {
    if (model && model.includes('$') && pattern.endsWith('!')) {
      const matches = new RegExp(`^${pattern.substring(0, pattern.length - 1)}`, 'iu').exec(original);
      if (matches) {
        matches.forEach((v, k) => {
          model = model.replace(`$${k}`, v);
        });
      }
    }
    return model;
  }

  /**
   *
   * @param {string} pattern
   * @param {string} model
   *
   * @return {boolean}
   */
  static hasMatch(pattern, model) {
    pattern = DeviceModels.cleanUpPattern(pattern);
    if (pattern.endsWith('!!')) {
      const regex2 = new RegExp(`^${pattern.substring(0, pattern.length - 2)}`, 'iu');
      return regex2.test(model);
    } else if (pattern.endsWith('!')) {
      const regex1 = new RegExp(`^${pattern.substring(0, pattern.length - 1)}`, 'iu');
      return regex1.test(model);
    } else {
      return pattern.toLowerCase() === model.toLowerCase();
    }
  }

  /**
   * Make the pattern compatible with JavaScript and transform it to string
   *
   * @param {string} pattern
   *
   * @return {string}
   */
  static cleanUpPattern(pattern) {
    return `${pattern}`.replace('(?i)', '').replace('\\-', '-');
  }

  /**
   * Make the pattern compatible with JavaScript key, remove something like O\+ and tranform it to O+
   *
   * @param {string} pattern
   *
   * @return {string}
   */
  static getKey(pattern) {
    return `${pattern}`.replace('\\', '');
  }

  /**
   *
   * @param {string} s
   *
   * @return {boolean}
   */
  static cleanup(s = '') {
    s = s.replace(/^phone\//, '');
    s = s.replace(/^(\/|; |;)/u, '');
    s = s.replace(/\/[^/]+$/u, '');
    s = s.replace(/\/[^/]+ Android\/.*/u, '');
    s = s.replace(/UCBrowser$/u, '');
    s = s.replace(/(_TD-LTE|_TD|_LTE|_GPRS|_BLEU|_CMCC|_CMCC_TD|_CUCC)$/u, '');
    s = s.replace(/(-BREW| MIDP).+$/u, '');
    s = s.replace(/ AU-MIC.+$/u, '');
    s = s.replace(/ (AU|UP)\.Browser$/u, '');
    s = s.replace(/_/gu, ' ');
    s = s.replace(/^\*+/gu, '');
    s = s.replace(/^\s+|\s+$/gu, '');
    s = s.replace(/^De-Sensed /u, '');
    s = s.replace(/^Full JellyBean( on )?/u, '');
    s = s.replace(/^(Android|Generic Android|Baidu Yi|Buildroid|Gingerbread|ICS AOSP|AOSPA?|tita) (on |for )/u, '');
    s = s.replace(
      /^Full (AOSP on |Android on |Base for |Cappuccino on |MIPS Android on |Webdroid on |JellyBean on |Android)/u,
      ''
    );
    s = s.replace(/^Acer( |-)?/iu, '');
    s = s.replace(/^Iconia( Tab)? /u, '');
    s = s.replace(/^ASUS ?/u, '');
    s = s.replace(/^Ainol /u, '');
    s = s.replace(/^Coolpad-?Coolpad/iu, 'Coolpad');
    s = s.replace(/^Coolpad ?/iu, 'Coolpad ');
    s = s.replace(/^Alcatel[_ ]OT[_-](.*)/iu, 'One Touch $1');
    s = s.replace(/^ALCATEL /u, '');
    s = s.replace(/^YL-/u, '');
    s = s.replace(/^TY-K[_\- ]Touch/iu, 'K-Touch');
    s = s.replace(/^K-Touch[_-]/u, 'K-Touch ');
    s = s.replace(/^Novo7 ?/iu, 'Novo7 ');
    s = s.replace(/^HW-HUAWEI/u, 'HUAWEI');
    s = s.replace(/^Huawei[ -]/iu, 'Huawei ');
    s = s.replace(/^SAMSUNG SAMSUNG-/iu, '');
    s = s.replace(/^SAMSUNG[ -]/iu, '');
    s = s.replace(/^(Sony ?Ericsson|Sony)/u, '');
    s = s.replace(/^(Lenovo Lenovo|LNV-Lenovo|LENOVO-Lenovo)/u, 'Lenovo');
    s = s.replace(/^Lenovo-/u, 'Lenovo');
    s = s.replace(/^Lenovo/u, 'Lenovo ');
    s = s.replace(/^ZTE-/u, 'ZTE ');
    s = s.replace(/^(LG)[ _/]/u, '$1-');
    s = s.replace(/^(HTC.+)\s[v|V][0-9.]+$/u, '$1');
    s = s.replace(/^(HTC)[-/]/u, '$1 ');
    s = s.replace(/^(HTC)([A-Z][0-9][0-9][0-9])/u, '$1 $2');
    s = s.replace(/^(Motorola MOT-|MOT-|Motorola[\s|-])/u, '');
    s = s.replace(/^Moto([^\s])/u, '$1');
    s = s.replace(/^(UTStar-)/u, '');
    s = s.replace(/^VZW:/iu, '');
    s = s.replace(/^(Swisscom|Vodafone)\/1.0\//iu, '');
    s = s.replace(/-?(orange(-ls)?|vodafone|bouygues|parrot|Kust)$/iu, '');
    s = s.replace(/[ -](Mozilla|Opera|Obigo|Java|PPC)$/iu, '');
    s = s.replace(/ ?Build$/iu, '');
    s = s.replace(/ \(compatible$/iu, '');
    s = s.replace(/http:\/\/.+$/iu, '');
    s = s.replace(/^\s+|\s+$/gu, '');
    s = s.replace(/\s+/gu, ' ');
    return s;
  }
}
const isDefined = (test) => typeof test !== 'undefined';

DeviceModels.ANDROID_MODELS = [];
DeviceModels.ASHA_MODELS = [];
DeviceModels.BADA_MODELS = [];
DeviceModels.BREW_MODELS = [];
DeviceModels.FIREFOXOS_MODELS = [];
DeviceModels.TIZEN_MODELS = [];
DeviceModels.TOUCHWIZ_MODELS = [];
DeviceModels.WM_MODELS = [];
DeviceModels.WP_MODELS = [];
DeviceModels.PALMOS_MODELS = [];
DeviceModels.S30PLUS_MODELS = [];
DeviceModels.S40_MODELS = [];
DeviceModels.SYMBIAN_MODELS = [];
DeviceModels.FEATURE_MODELS = [];
DeviceModels.BLACKBERRY_MODELS = [];
DeviceModels.IOS_MODELS = [];
DeviceModels.KDDI_MODELS = [];

DeviceModels.ANDROID_INDEX = [];
DeviceModels.ASHA_INDEX = [];
DeviceModels.BADA_INDEX = [];
DeviceModels.BREW_INDEX = [];
DeviceModels.FIREFOXOS_INDEX = [];
DeviceModels.TIZEN_INDEX = [];
DeviceModels.TOUCHWIZ_INDEX = [];
DeviceModels.WM_INDEX = [];
DeviceModels.WP_INDEX = [];
DeviceModels.PALMOS_INDEX = [];
DeviceModels.S30PLUS_INDEX = [];
DeviceModels.S40_INDEX = [];
DeviceModels.SYMBIAN_INDEX = [];
DeviceModels.FEATURE_INDEX = [];
DeviceModels.KDDI_INDEX = [];

module.exports = DeviceModels;
