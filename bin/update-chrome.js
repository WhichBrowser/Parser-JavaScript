/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Chrome = require('../src/data/Chrome');
console.log('Updating chrome versions...');
const filepath = path.join(__dirname, '../data/browsers-chrome.js');

/* OmahaProxy (the previous source for this data) has been shut down; the Chromium Dash
 * release API is the maintained replacement. `num` is capped server-side at 1000, which
 * is enough to cover the full Stable release history for both platforms. */
const ENDPOINT = 'https://chromiumdash.appspot.com/fetch_releases?channel=Stable&num=1000&platform=';

function compareVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

function fetchPlatform(platform, callback) {
  const url = ENDPOINT + platform;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${url} responded with HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((body) => {
      if (!Array.isArray(body)) {
        throw new Error(`${url} returned an unexpected payload`);
      }
      callback(body.map((release) => release.version.split('.').slice(0, 3).join('.')));
    })
    .catch((err) => {
      console.error(`Failed to fetch ${platform} releases: ${err.message}`);
      process.exitCode = 1;
      callback([]);
    });
}

fetchPlatform('Mac', (desktopVersions) => {
  fetchPlatform('Android', (mobileVersions) => {
    let countNewDesktop = 0;
    desktopVersions.forEach((version) => {
      if (!Chrome.DESKTOP[version]) {
        Chrome.DESKTOP[version] = 'stable';
        countNewDesktop++;
      }
    });

    let countNewMobile = 0;
    mobileVersions.forEach((version) => {
      if (!Chrome.MOBILE[version]) {
        Chrome.MOBILE[version] = 'stable';
        countNewMobile++;
      }
    });

    const fileStream = fs.createWriteStream(filepath);
    fileStream.write('module.exports = {\n');
    fileStream.write('  DESKTOP: {\n');
    Object.keys(Chrome.DESKTOP)
      .sort(compareVersions)
      .forEach((version) => fileStream.write(`    '${version}': '${Chrome.DESKTOP[version]}',\n`));
    fileStream.write('  },\n');
    fileStream.write('  MOBILE: {\n');
    Object.keys(Chrome.MOBILE)
      .sort(compareVersions)
      .forEach((version) => fileStream.write(`    '${version}': '${Chrome.MOBILE[version]}',\n`));
    fileStream.write('  },\n');
    fileStream.write('};\n');
    fileStream.end();

    console.log(`Updated chrome with ${countNewDesktop} new stable version for DEKSTOP`);
    console.log(`Updated chrome with ${countNewMobile} new stable version for MOBILE`);
  });
});
