/* eslint-disable no-console */
const request = require('request');
const fs = require('fs');
const path = require('path');
console.log('Updating browser ids...');
const filepath = path.join(__dirname, '../data/id-android.js');
const fileStream = fs.createWriteStream(filepath);

request('https://api.whichbrowser.net/resources/browser-ids.json', (err, response = {}) => {
  if (err) {
    return;
  }
  const result = JSON.parse(response.body);
  fileStream.write('exports.ANDROID_BROWSERS = {\n');
  result.reduce((acc, val) => fileStream.write(`    '${val.browserId}': ${deviceString(val.browserName)},\n`), null);
  fileStream.write('};\n');
  fileStream.end();
  console.log(`Browser ids update complete with ${result.length} entries...`);
});


/**
 *
 * @param {string|null} str
 *
 * @return {string}
 */
function deviceString(str) {
  if (!str) {
    return null;
  }
  return `'${(str + '').replace(/[\\']/g, '\\$&').replace(/\u0000/g, '\\0')}'`;
}
