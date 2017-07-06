/* eslint-disable require-jsdoc */

const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Parser = require('../../src/Parser');
const path = require('path');
const fs = require('fs');
const yaml = require('yamljs');

function getDirContent(category = '') {
  return fs.readdirSync(path.join(__dirname, '../data', category));
}

describe('Testing Parser with YAML files', () => {
  getDirContent().forEach((category) => {
    getDirContent(category).forEach((file) => {
      const yamlContent = yaml.load(path.join(__dirname, '../data', category, file));
      yamlContent.forEach(makeTest);
    });
  });
});

function makeTest(options) {
  it(`With header: ${options.headers}`, (done) => {
    if (options.headers && typeof options.headers === 'string') {
      options.headers = parseHeaders(options.headers);
    }
    const parserObj = new Parser(options);

    expect(parserObj.toString()).to.be.equal(options.readable);
    expect(parserObj.toObject()).to.be.equal(options.result);
    done();
  });
}

function parseHeaders(rawHeaders) {
  const headers = {};
  let key = '';

  for (let header of rawHeaders.split('\n')) {
    let [headerName, ...headerValue] = header.split(':');
    headerValue = headerValue.join(':');
    if (headerValue) {
      if (!headers[headerName]) {
        headers[headerName] = headerValue.trim();
      } else if (Array.isArray(headers[headerName])) {
        headers[headerName] = [...headers[headerName], headerValue.trim()];
      } else {
        headers[headerName] = [headers[headerName], headerValue.trim()];
      }

      key = headerName;
    } else {
      if (/^\t/.test(headerName)) {
        headers[key] += `\r\n\t${headerName.trim()}`;
      } else if (!key) {
        headers[0] = headerName.trim();
      }
      headerName.trim();
    }
  }

  return headers;
}
