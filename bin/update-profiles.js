/* eslint-disable no-console */
const request = require('request');
const fs = require('fs');
const path = require('path');
console.log('Updating profiles...');
const filepath = path.join(__dirname, '../data/profiles.js');
const fileStream = fs.createWriteStream(filepath);

request('https://api.whichbrowser.net/resources/profiles.json', (err, response = {}) => {
  if (err) {
    return;
  }
  const result = JSON.parse(response.body);
  fileStream.write('/* This file is automatically generated, do not edit manually! */\n\n');
  fileStream.write('/* eslint-disable max-len */\n\n');
  fileStream.write("const DeviceType = require('../src/constants').deviceType;\n\n");
  fileStream.write('exports.PROFILES = {\n');
  result.forEach(
    (profile) =>
      fileStream.write(
        `  ${escapeString(profile.url)}: ` +
          `[${escapeString(profile.deviceManufacturer)}, ${escapeString(profile.deviceModel)}, ` +
          `${escapeString(profile.osName)}` +
          `${deviceType(profile.deviceType) ? `, ${deviceType(profile.deviceType)}` : ''}],\n`
      ),
    null
  );
  fileStream.write('};\n\n');
  fileStream.write('/* eslint-enable max-len */\n\n');
  fileStream.write('/* This file is automatically generated, do not edit manually! */\n');
  fileStream.end();
  console.log(`Downloaded ${result.length} profiles...`);
});

/**
 * Escapes \ and ' inside string
 *
 * @param {string|null} str
 *
 * @return {string|null}
 */
function escapeString(str) {
  if (!str) {
    return null;
  }
  return `'${(str + '')
    .replace(/[\\']/g, '\\$&')
    .replace(/\u{0000}/gu, '\\0')
    .replace(/\u{2002}/gu, ' ')}'`;
}

/**
 * Return right constants for devices
 *
 * @param {string|null} type
 *
 * @return {string|null}
 */
function deviceType(type) {
  switch (type) {
    case 'mobile':
      return 'DeviceType.MOBILE';
    case 'tablet':
      return 'DeviceType.TABLET';
  }
}
