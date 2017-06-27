/**
 * @internal
 */
class Base {
  /**
   * Set the properties of the object the the values specified in the object
   *
   * @param  {Object|null} defaults  An Object, the key of an element determines the name of the property
   */
  constructor(defaults) {
    defaults && this.set(defaults);
  }

  /**
   * Set the properties of the object the the values specified in the object
   *
   * @param  {Object}  properties  An Object, the key of an element determines the name of the property
   *
   * @internal
   */
  set(properties) {
    Object.assign(this, properties);
  }
}
module.exports = Base;
