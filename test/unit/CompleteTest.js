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
  getDirContent().slice(0, 1).forEach((category) => {
    getDirContent(category).forEach((file) => {
      const yamlContent = yaml.load(path.join(__dirname, '../data', category, file));
      yamlContent.forEach(makeTest);
    });
  });
});

function makeTest({headers, result, readable}) {
  it(`With header: ${headers}`, (done) => {
    if (typeof headers === 'string' && headers.startsWith('User-Agent: ')) {
      headers = headers.replace('User-Agent: ', '');
    }
    // typeof headers !== 'string' && console.log('typetype', JSON.stringify(headers));
    const parserObj = new Parser(headers);

    expect(parserObj.toString()).to.be.equal(readable);
    done();
  });
}
