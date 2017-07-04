/* eslint-disable require-jsdoc */

const {
  Appliance,
  Cars,
  Ereader,
  Gaming,
  Gps,
  Media,
  Mobile,
  Pda,
  Phone,
  Printer,
  Signage,
  Tablet,
  Television,
} = require('./Device/');

class Device {
  static detectDevice(ua) {
    Appliance.detectAppliance.call(this, ua);
    Cars.detectCars.call(this, ua);
    Gps.detectGps.call(this, ua);
    Ereader.detectEreader.call(this, ua);
    Gaming.detectGaming.call(this, ua);
    Television.detectTelevision.call(this, ua);
    Signage.detectSignage.call(this, ua);
    Media.detectMedia.call(this, ua);
    Pda.detectPda.call(this, ua);
    Printer.detectPrinter.call(this, ua);
    Tablet.detectTablet.call(this, ua);
    Phone.detectPhone.call(this, ua);
    Mobile.detectMobile.call(this, ua);
    return this;
  }
}

module.exports = Device;
