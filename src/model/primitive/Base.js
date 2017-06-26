class Base {
  constructor(defaults) {
    defaults && this.set(defaults);
  }
  set(properties){
    properties = JSON.parse(JSON.stringify(properties));
    Object.assign(this, properties);
  }
  toJavaScript (){
    console.error('remove this method');
    return this;
  }
}
exports.Base = Base;
