/* eslint-disable no-console */
const request = require('request');
const fs = require('fs');
const path = require('path');
const Chrome = require('../src/data/Chrome');
console.log('Updating chrome versions...');
const filepath = path.join(__dirname, '../data/browsers-chrome.js');
const fileStream = fs.createWriteStream(filepath);
const stable = {
  desktop: new Set(),
  mobile: new Set(),
};
request('http://omahaproxy.appspot.com/history', (err, response = {}) => {
  if (err) {
    return;
  }
  const omaha = response.body.split('\n');
  omaha.forEach((line) => {
    const [os, stability, version] = line.split(',');
    if (os === 'mac' && stability === 'stable') {
      stable.desktop.add(version.split('.').slice(0, 3).join('.'));
    }
    if (os === 'android' && stability === 'stable') {
      stable.mobile.add(version.split('.').slice(0, 3).join('.'));
    }
  });

  stable.desktop = Array.from(stable.desktop);
  stable.mobile = Array.from(stable.mobile);

  let countNewDesktop = 0;
  stable.desktop.forEach((version) => {
    if (!Chrome.DESKTOP[version]) {
      Chrome.DESKTOP[version] = 'stable';
      countNewDesktop++;
    }
  });

  let countNewMobile = 0;
  stable.mobile.forEach((version) => {
    if (!Chrome.MOBILE[version]) {
      Chrome.MOBILE[version] = 'stable';
      countNewMobile++;
    }
  });


  fileStream.write('module.exports = {\n');
  fileStream.write('  DESKTOP: {\n');
  Object.keys(Chrome.DESKTOP)
    .forEach((version) => fileStream.write(`    '${version}': '${Chrome.DESKTOP[version]}',\n`));
  fileStream.write('  },\n');
  fileStream.write('  MOBILE: {\n');
  Object.keys(Chrome.MOBILE)
    .forEach((version) => fileStream.write(`    '${version}': '${Chrome.MOBILE[version]}',\n`));
  fileStream.write('  },\n');
  fileStream.write('};\n');

  fileStream.end();

  console.log(`Updated chrome with ${countNewDesktop} new stable version for DEKSTOP`);
  console.log(`Updated chrome with ${countNewMobile} new stable version for MOBILE`);
});
