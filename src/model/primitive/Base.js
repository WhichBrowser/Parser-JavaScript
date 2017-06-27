class Base {
  constructor(defaults) {
    defaults && this.set(defaults);
  }

  set(properties) {
    Object.assign(this, properties);
  }
}
module.exports = Base;
