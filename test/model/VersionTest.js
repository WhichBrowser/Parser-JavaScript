const {describe, it} = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Version = require('../../src/model/Version');

describe('Version Class', () => {
  describe('\'is\' method', () => {
    describe('with zero or one parameter', () => {
      it('should work as expected', () => {
        const version = new Version({value: '40.0.2214'});
        expect(version.is()).to.be.false();
        expect(version.is('39')).to.be.false();
        expect(version.is('40')).to.be.true();
      });
    });

    describe('with operator and major version compare', () => {
      it('should work as expected', () => {
        const version = new Version({value: '40.0.2214'});
        expect(version.is('=', '40')).to.be.true();
        expect(version.is('>=', '40')).to.be.true();
        expect(version.is('<=', '40')).to.be.true();
        expect(version.is('>', '39')).to.be.true();
        expect(version.is('<', '41')).to.be.true();

        expect(version.is('=', '39')).to.be.false();
        expect(version.is('>=', '41')).to.be.false();
        expect(version.is('<=', '39')).to.be.false();
        expect(version.is('>', '40')).to.be.false();
        expect(version.is('<', '40')).to.be.false();
      });
    });

    describe('with operator and major, minor and patch version compare', () => {
      it('should work as expected', () => {
        const version = new Version({value: '10.11.1'});
        expect(version.is('=', '10')).to.be.true();
        expect(version.is('=', '10.11')).to.be.true();
        expect(version.is('=', '10.11.1')).to.be.true();
        expect(version.is('=', '10.11.01')).to.be.true();

        expect(version.is('=', 10)).to.be.true();
        expect(version.is('=', 10.11)).to.be.true();

        expect(version.is('>', '10.1')).to.be.true();
        expect(version.is('>', '10.01')).to.be.true();
        expect(version.is('>', '10.10')).to.be.true();

        expect(version.is('>', '10')).to.be.false();
        expect(version.is('>', '10.11')).to.be.false();
      });
    });

    describe('with operator and major, minor as float', () => {
      it('should work as expected', () => {
        const version = new Version({value: 10.11});
        expect(version.is('=', '10')).to.be.true();
        expect(version.is('=', '10.11')).to.be.true();
        expect(version.is('=', '10.11.1')).to.be.true();
        expect(version.is('=', '10.11.01')).to.be.true();

        expect(version.is('=', 10)).to.be.true();
        expect(version.is('=', 10.11)).to.be.true();

        expect(version.is('>', '10.1')).to.be.true();
        expect(version.is('>', '10.01')).to.be.true();
        expect(version.is('>', '10.10')).to.be.true();

        expect(version.is('>', '10')).to.be.false();
        expect(version.is('>', '10.11')).to.be.false();
      });
    });
  });

  describe('getParts method', () => {
    describe('with no version', () => {
      it('should return 0, 0, 0 object', () => {
        const version = new Version();
        version.value = '';
        expect(version.getParts()).to.equal({major: 0, minor: 0, patch: 0});
      });
    });

    describe('with major version', () => {
      it('should return major, 0, 0 object', () => {
        const version = new Version();
        version.value = '4';
        expect(version.getParts()).to.equal({major: 4, minor: 0, patch: 0});
      });
    });

    describe('with major and minor version', () => {
      it('should return major, minor, 0 object', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.getParts()).to.equal({major: 4, minor: 1, patch: 0});
      });
    });

    describe('with major minor and patch version', () => {
      it('should return major, minor, patch object', () => {
        const version = new Version();
        version.value = '4.1.2';
        expect(version.getParts()).to.equal({major: 4, minor: 1, patch: 2});
      });
    });
  });

  describe('getMajor method', () => {
    describe('with no version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '';
        expect(version.getMajor()).to.equal(0);
      });
    });

    describe('with major version', () => {
      it('should return the major version', () => {
        const version = new Version();
        version.value = '4';
        expect(version.getMajor()).to.equal(4);
      });
    });

    describe('with major and minor version', () => {
      it('should return the major version', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.getMajor()).to.equal(4);
      });
    });

    describe('with major minor and patch version', () => {
      it('should return the major version', () => {
        const version = new Version();
        version.value = '4.1.2';
        expect(version.getMajor()).to.be.equal(4);
      });
    });
  });

  describe('getMinor method', () => {
    describe('with no version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '';
        expect(version.getMinor()).to.equal(0);
      });
    });

    describe('with major version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '4';
        expect(version.getMinor()).to.equal(0);
      });
    });

    describe('with major and minor version', () => {
      it('should return the minor version', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.getMinor()).to.equal(1);
      });
    });

    describe('with major minor and patch version', () => {
      it('should return the minor version', () => {
        const version = new Version();
        version.value = '4.1.2';
        expect(version.getMinor()).to.be.equal(1);
      });
    });
  });

  describe('getPatch method', () => {
    describe('with no version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '';
        expect(version.getPatch()).to.equal(0);
      });
    });

    describe('with major version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '4';
        expect(version.getPatch()).to.equal(0);
      });
    });

    describe('with major and minor version', () => {
      it('should return 0', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.getPatch()).to.equal(0);
      });
    });

    describe('with major minor and patch version', () => {
      it('should return the patch version', () => {
        const version = new Version();
        version.value = '4.1.2';
        expect(version.getPatch()).to.be.equal(2);
      });
    });
  });

  describe('toValue method', () => {
    describe('with only major', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4';
        expect(version.toValue()).to.equal(4);
      });
    });

    describe('with major and minor version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.toValue()).to.equal(4.0001);
      });
    });

    describe('with major, minor and patch version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1.1';
        expect(version.toValue()).to.equal(4.00010001);
      });
    });

    describe('with major minor  version with two digit and patch version with one digit', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '10.10.3';
        expect(version.toValue()).to.be.equal(10.00100003);
      });
    });
  });

  describe('toFloat method', () => {
    describe('with only major', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4';
        expect(version.toFloat()).to.equal(4);
      });
    });

    describe('with major and minor version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.toFloat()).to.equal(4.1);
      });
    });

    describe('with major, minor and patch version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1.1';
        expect(version.toFloat()).to.equal(4.1);
      });
    });

    describe('with major minor  version with two digit and patch version with one digit', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '10.10.3';
        expect(version.toFloat()).to.be.equal(10.1);
      });
    });
  });

  describe('toNumber method', () => {
    describe('with only major', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4';
        expect(version.toNumber()).to.equal(4);
      });
    });

    describe('with major and minor version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1';
        expect(version.toNumber()).to.equal(4);
      });
    });

    describe('with major, minor and patch version', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '4.1.1';
        expect(version.toNumber()).to.equal(4);
      });
    });

    describe('with major minor  version with two digit and patch version with one digit', () => {
      it('should work', () => {
        const version = new Version();
        version.value = '10.10.3';
        expect(version.toNumber()).to.be.equal(10);
      });
    });
  });

  describe('toString method', () => {
    describe('with no details or builds', () => {
      it('should work as expected', () => {
        const version = new Version();

        version.value = '4.1.1';
        expect(version.toString()).to.equal('4.1.1');

        version.value = '4.1';
        expect(version.toString()).to.equal('4.1');

        version.value = '4.0a4';
        expect(version.toString()).to.equal('4.0a4');

        version.value = '4.0b2';
        expect(version.toString()).to.equal('4.0b2');
      });
    });

    describe('with details but not builds', () => {
      it('should work as expected', () => {
        const version = new Version();

        version.set({value: '4.1.1', details: 0});
        expect(version.toString()).to.equal('4.1.1');

        version.set({value: '4.1.1', details: 1});
        expect(version.toString()).to.equal('4');

        version.set({value: '4.1.1', details: 2});
        expect(version.toString()).to.equal('4.1');

        version.set({value: '4.1.1', details: 3});
        expect(version.toString()).to.equal('4.1.1');

        version.set({value: '4.1.1', details: 4});
        expect(version.toString()).to.equal('4.1.1');

        version.set({value: '4.1', details: 3});
        expect(version.toString()).to.equal('4.1');

        version.set({value: '4.1.1', details: -1});
        expect(version.toString()).to.equal('4.1');

        version.set({value: '4.1.1', details: -2});
        expect(version.toString()).to.equal('4');

        version.set({value: '4.1.1', details: -3});
        expect(version.toString()).to.equal('');

        version.set({value: '4.1.1', details: -4});
        expect(version.toString()).to.equal('');
      });
    });

    describe('with builds but not details', () => {
      it('should work as expected', () => {
        const version = new Version();

        version.set({value: '5.0.2.999', builds: false});
        expect(version.toString()).to.equal('5.0.2.999');

        version.set({value: '5.0.2.1000', builds: false});
        expect(version.toString()).to.equal('5.0.2');

        version.set({value: '5.0.2.4428', builds: false});
        expect(version.toString()).to.equal('5.0.2');

        version.set({value: '5.0.4428', builds: false});
        expect(version.toString()).to.equal('5.0');

        version.set({value: '5.4428', builds: false});
        expect(version.toString()).to.equal('5');

        version.set({value: '4428', builds: false});
        expect(version.toString()).to.equal('');
      });
    });

    describe('with alias', () => {
      it('should return alias', () => {
        const version = new Version();

        version.set({value: '5.1', alias: 'XP'});
        expect(version.toString()).to.be.equal('XP');
      });
    });

    describe('with nickname', () => {
      it('should return nickaname and version', () => {
        const version = new Version();

        version.set({value: '10.11', nickname: 'El Captain'});
        expect(version.toString()).to.be.equal('El Captain 10.11');
      });
    });

    describe('with nickname and details', () => {
      it('should return nickname and a subset of verson', () => {
        const version = new Version();

        version.set({value: '10.11.2', nickname: 'El Captain', details: 2});
        expect(version.toString()).to.be.equal('El Captain 10.11');
      });
    });
  });

  describe('toObject method', () => {
    describe('with all properties empty', () => {
      it('should return an empty object', () => {
        const version = new Version();

        expect(version.toObject()).equal({});
      });
    });

    describe('with value filled', () => {
      it('should return the only value', () => {
        const version = new Version();

        version.set({value: '4.1.1'});
        expect(version.toObject()).to.equal('4.1.1');
      });
    });

    describe('with value and details filled', () => {
      it('should return the with value according to details level', () => {
        const version = new Version();

        version.set({value: '4.1.1', details: 2});
        expect(version.toObject()).to.equal('4.1');
      });
    });

    describe('with value and alias filled', () => {
      it('should return an object with value and alias properties', () => {
        const version = new Version();
        const properties = {value: '5.1', alias: 'XP'};
        version.set(properties);

        expect(version.toObject()).to.equal(properties);
      });
    });

    describe('with value and nickname filled', () => {
      it('should return an object with value and nickname properties', () => {
        const version = new Version();
        const properties = {value: '10.11', nickname: 'El Captain'};
        version.set(properties);

        expect(version.toObject()).to.equal(properties);
      });
    });
  });
});
