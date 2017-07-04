const Base = require('./primitive/Base');
const Constants = require('../constants');

/**
 * Represents a Device
 *
 * @internal
 */
class Device extends Base {
  /**
   * constructor
   *
   * @param {object} [properties]
   * @param {string} [properties.manufacturer]
   * @param {string} [properties.model]
   * @param {string} [properties.series]
   * @param {string} [properties.carrier]
   * @param {number} [properties.identifier]
   * @param {string|number} [properties.flag]
   * @param {string} [properties.type='']
   * @param {string} [properties.subtype='']
   * @param {number} [properties.identified=Constants.id.NONE]
   * @param {boolean} [properties.generic=true]
   * @param {boolean} [properties.hidden=false]
   *
   * @internal
   */
  constructor(properties = {}) {
    super(
      Object.assign(
        {},
        {
          type: '',
          subtype: '',
          identified: Constants.id.NONE,
          generic: true,
          hidden: false,
        },
        properties
      )
    );
  }

  /**
   * Set the properties to the default values
   *
   * @param   {object|null}  properties  An optional object of properties to set after setting it to the default values
   *
   * @internal
   */
  reset(properties = null) {
    this.manufacturer = null;
    this.model = null;
    this.series = null;
    this.carrier = null;
    this.identifier = null;
    this.type = '';
    this.subtype = '';
    this.identified = Constants.id.NONE;
    this.generic = true;
    this.hidden = false;
    properties && this.set(properties);
  }

  /**
   * Identify the manufacturer and model based on a pattern
   *
   * @param   {RegExp}      pattern   The regular expression that defines the group that matches the model
   * @param   {string}      subject   The string the regular expression is matched with
   * @param   {object|null}  defaults  An optional object of properties to set together
   *
   */
  identifyModel(pattern, subject, defaults = {}) {
    let match;
    if ((match = subject.match(pattern))) {
      const DeviceModels = require('../data/DeviceModels');
      this.manufacturer = defaults['manufacturer'] || null;
      this.model = DeviceModels.cleanup(match[1]);
      this.identifier = match[0].replace(
        / (Mozilla|Opera|Obigo|AU.Browser|UP.Browser|Build|Java|PPC|AU-MIC.*)$/giu,
        ''
      );
      this.identifier = match[0].replace(/_(TD|GPRS|LTE|BLEU|CMCC|CUCC)$/giu, '');
      if (defaults.model) {
        if (typeof defaults.model === 'function') {
          this.model = defaults.model(this.model);
        } else {
          this.model = defaults.model;
        }
      }
      this.generic = false;
      this.identified = this.identified || Constants.id.PATTERN;
      if (defaults.carrier) {
        this.carrier = defaults.carrier;
      }
      if (defaults.type) {
        this.type = defaults.type;
      }
    }
  }

  /**
   * Declare an positive identification
   *
   * @param  {object}  properties  An object, the key of an element determines the name of the property
   *
   */
  setIdentification(properties) {
    this.reset(properties);
    if (this.model) {
      this.generic = false;
    }

    this.identified = this.isIdentified() ? this.identified : Constants.id.MATCH_UA;
  }

  /**
   * Get the name of the carrier in a human readable format
   *
   * @return {string}
   */
  getCarrier() {
    return this.isIdentified() && this.carrier ? this.carrier : '';
  }

  /**
   * Get the name of the manufacturer in a human readable format
   *
   * @return {string}
   */
  getManufacturer() {
    return this.isIdentified() && this.manufacturer ? this.manufacturer : '';
  }

  /**
   * Get the name of the model in a human readable format
   *
   * @return {string}
   */
  getModel() {
    if (this.isIdentified()) {
      return `${this.model ? `${this.model} ` : ''}${this.series || ''}`.trim();
    }
    return this.model || '';
  }

  /**
   * Get the combined name of the manufacturer and model in a human readable format
   *
   * @return {string}
   */
  toString() {
    if (this.hidden) {
      return '';
    }

    if (this.isIdentified()) {
      const model = this.getModel();
      let manufacturer = this.getManufacturer();
      if (manufacturer !== '' && model.startsWith(manufacturer)) {
        manufacturer = '';
      }
      return `${manufacturer} ${model}`.trim();
    }
    return this.model ? `unrecognized device (${this.model})` : '';
  }

  /**
   * Check if device information is detected
   *
   * @return {boolean}
   */
  isDetected() {
    return !!this.type || !!this.model || !!this.manufacturer;
  }

  /**
   * Get an object of all defined properties
   *
   * @internal
   *
   * @return {object}
   */
  toObject() {
    const result = {};
    if (this.type) {
      result.type = this.type;
    }

    if (this.subtype) {
      result.subtype = this.subtype;
    }
    if (this.manufacturer) {
      result.manufacturer = this.manufacturer;
    }
    if (this.model) {
      result.model = this.model;
    }
    if (this.series) {
      result.series = this.series;
    }
    if (this.carrier) {
      result.carrier = this.carrier;
    }
    return result;
  }

  /**
   * Evaluate if identified is set
   *
   * @internal
   *
   * @return {boolean}
   */
  isIdentified() {
    return typeof this.identified !== 'undefined' && this.identified !== Constants.id.NONE;
  }
}

module.exports = Device;
