const {describe, it} = (exports.lab = require('lab').script());
const expect = require('code').expect;
const Os = require('../../src/model/Os');
const Version = require('../../src/model/Version');
const Family = require('../../src/model/Family');

describe('Os Class', () => {
  describe('reset method', () => {
    describe('reset to clean state', () => {
      it('should return the right name', (done) => {
        const os = new Os({
          name: 'iOS',
          alias: 'iPhone OS',
          hidden: true,
          version: new Version({value: '3.0'}),
        });
        expect(os.name).to.be.equal('iOS');
        expect(os.alias).to.be.equal('iPhone OS');
        expect(os.hidden).to.be.true();
        expect(os.version).to.be.instanceOf(Version);

        os.reset();

        expect(os.name).to.not.exists();
        expect(os.alias).to.not.exists();
        expect(os.hidden).to.be.false();
        expect(os.version).to.not.exists();

        done();
      });
    });

    describe('reset to a new state', () => {
      it('should return the alias', (done) => {
        const os = new Os({
          name: 'iOS',
          alias: 'iPhone OS',
          hidden: true,
          version: new Version({value: '3.0'}),
        });
        expect(os.name).to.be.equal('iOS');
        expect(os.alias).to.be.equal('iPhone OS');
        expect(os.hidden).to.be.true();
        expect(os.getVersion()).to.be.equal('3.0');

        os.reset({
          name: 'Android',
          alias: 'Android OS',
          version: new Version({value: '4.1.1'}),
        });

        expect(os.name).to.be.equal('Android');
        expect(os.alias).to.be.equal('Android OS');
        expect(os.hidden).to.be.false();
        expect(os.getVersion()).to.be.equal('4.1.1');

        done();
      });
    });
  });

  describe('getName method', () => {
    describe('without alias', () => {
      it('should return the right name', (done) => {
        const os = new Os();
        expect(os.getName()).to.be.empty();

        os.reset({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });

        expect(os.getName()).to.be.equal('iOS');

        done();
      });
    });

    describe('with alias', () => {
      it('should return the alias', (done) => {
        const os = new Os();
        expect(os.getName()).to.be.empty();

        os.reset({
          name: 'iOS',
          alias: 'iPhone OS',
          version: new Version({value: '3.0'}),
        });

        expect(os.getName()).to.be.equal('iPhone OS');

        done();
      });
    });
  });

  describe('getVersion method', () => {
    describe('with only value', () => {
      it('should return the version', (done) => {
        const os = new Os({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });


        expect(os.getVersion()).to.be.equal('8.0');

        done();
      });
    });

    describe('with value and nickname', () => {
      it('should return nickname + value', (done) => {
        const os = new Os({
          name: 'OS X',
          version: new Version({value: '10.11', nickname: 'El Captain'}),
        });


        expect(os.getVersion()).to.be.equal('El Captain 10.11');

        done();
      });
    });

    describe('with value and alias', () => {
      it('should return the alias', (done) => {
        const os = new Os({
          name: 'Windows',
          version: new Version({value: '5.1', alias: 'XP'}),
        });

        expect(os.getVersion()).to.be.equal('XP');

        done();
      });
    });
  });

  describe('isDetected method', () => {
    it('should return the right version', (done) => {
      const os = new Os();
      expect(os.isDetected()).to.be.false();

      os.reset({
        name: 'iOS',
        version: new Version({value: '8.0'}),
      });

      expect(os.isDetected()).to.be.true();

      done();
    });
  });

  describe('isFamily method', () => {
    describe('without family property', () => {
      it('the family should match the name', (done) => {
        const os = new Os({
          name: 'Android',
        });

        expect(os.isFamily('Android')).to.be.true();

        done();
      });
    });

    describe('with family property that match the isFamily parameter', () => {
      it('should return true', (done) => {
        const os = new Os({
          name: 'FireOS',
          family: new Family({name: 'Android'}),
        });

        expect(os.isFamily('Android')).to.be.true();

        done();
      });
    });

    describe('with family property that doesn\'t match the isFamily parameter', () => {
      it('should return false', (done) => {
        const os = new Os({
          name: 'FireOS',
          family: new Family({name: 'Android'}),
        });

        expect(os.isFamily('iOS')).to.be.false();

        done();
      });
    });
  });

  describe('toString method', () => {
    describe('without alias property', () => {
      it('should return the name and version', (done) => {
        const os = new Os({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });

        expect(os.toString()).to.be.equal('iOS 8.0');

        done();
      });
    });

    describe('with alias property', () => {
      it('should return the alias and version', (done) => {
        const os = new Os({
          name: 'iOS',
          alias: 'iPhone OS',
          version: new Version({value: '3.0'}),
        });

        expect(os.toString()).to.be.equal('iPhone OS 3.0');

        done();
      });
    });

    describe('with version nickname', () => {
      it('should return the name, alias and version', (done) => {
        const os = new Os({
          name: 'OS X',
          version: new Version({value: '10.11', nickname: 'El Captain'}),
        });

        expect(os.toString()).to.be.equal('OS X El Captain 10.11');

        done();
      });
    });

    describe('with version alias', () => {
      it('should return the name and alias', (done) => {
        const os = new Os({
          name: 'Windows',
          version: new Version({value: '10.11', alias: 'XP'}),
        });

        expect(os.toString()).to.be.equal('Windows XP');

        done();
      });
    });

    describe('with family alias and edition and version alias', () => {
      it('should return the family alias, version alias and family edition', (done) => {
        const os = new Os({
          name: 'Windows Phone',
          alias: 'Windows',
          edition: 'Mobile',
          version: new Version({value: '10.0', alias: '10'}),
        });

        expect(os.toString()).to.be.equal('Windows 10 Mobile');

        done();
      });
    });

    describe('with hidden set to true', () => {
      it('should return empty string', (done) => {
        const os = new Os({
          name: 'webOS',
          hidden: true,
        });

        expect(os.toString()).to.be.empty();

        done();
      });
    });
  });

  describe('identifyVersion method', () => {
    describe('with matching RegExp and underscore type', () => {
      it('should return the version with underscore replaced', (done) => {
        const os = new Os();

        os.identifyVersion(/OS ([0-9_]+)/u, 'iPhone OS 9_0_2', {type: 'underscore'});

        expect(os.getVersion()).to.be.equal('9.0.2');

        done();
      });
    });

    describe('with matching RegExp', () => {
      it('should return the correct version', (done) => {
        const os = new Os();

        os.identifyVersion(/Android\/([0-9.]+)/u, 'Android/6.0');

        expect(os.getVersion()).to.be.equal('6.0');

        done();
      });
    });

    describe('with not matching RegExp', () => {
      it('should return empty version', (done) => {
        const os = new Os();

        os.identifyVersion(/Tizen\/([0-9.]+)/u, 'Android/6.0');

        expect(os.getVersion()).to.be.empty();

        done();
      });
    });
  });

  describe('toObject method', () => {
    describe('with name as empty string', () => {
      it('should return an empty object', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.set({
          name: '',
        });

        expect(os.toObject()).to.be.empty();

        done();
      });
    });

    describe('with name and version defined', () => {
      it('should return an object with both properties', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'iOS',
          version: new Version({value: '8.0'}),
        });

        expect(os.toObject()).to.equal({
          name: 'iOS',
          version: '8.0',
        });

        done();
      });
    });

    describe('with name, alias and version defined', () => {
      it('should return an object with both properties', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'iOS',
          alias: 'iPhone OS',
          version: new Version({value: '3.0'}),
        });

        expect(os.toObject()).to.equal({
          name: 'iOS',
          alias: 'iPhone OS',
          version: '3.0',
        });

        done();
      });
    });

    describe('with name and version nickname', () => {
      it('should return an object with both properties exploded', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'OS X',
          version: new Version({value: '10.11', nickname: 'El Captain'}),
        });

        expect(os.toObject()).to.equal({
          name: 'OS X',
          version: {value: '10.11', nickname: 'El Captain'},
        });

        done();
      });
    });

    describe('with name and version alias', () => {
      it('should return an object with both properties exploded', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'Windows',
          version: new Version({value: '5.1', alias: 'XP'}),
        });

        expect(os.toObject()).to.equal({
          name: 'Windows',
          version: {value: '5.1', alias: 'XP'},
        });

        done();
      });
    });

    describe('with name, alias, edition and version alias', () => {
      it('should return an object with all properties exploded', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'Windows Phone',
          alias: 'Windows',
          edition: 'Mobile',
          version: new Version({value: '10.0', alias: '10'}),
        });

        expect(os.toObject()).to.equal({
          name: 'Windows Phone',
          alias: 'Windows',
          edition: 'Mobile',
          version: {value: '10.0', alias: '10'},
        });

        done();
      });
    });

    describe('with name and family', () => {
      it('should return an object with all properties exploded', (done) => {
        const os = new Os();
        expect(os.toObject()).to.be.empty();

        os.reset({
          name: 'FireOS',
          family: new Family({name: 'Android'}),
        });

        expect(os.toObject()).to.equal({
          name: 'FireOS',
          family: 'Android',
        });

        done();
      });
    });
  });
});
