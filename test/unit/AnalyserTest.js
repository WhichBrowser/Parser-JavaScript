const {describe, it} = (exports.lab = require('@hapi/lab').script());
const expect = require('@hapi/code').expect;
const Main = require('../../src/model/Main');
const Analyser = require('../../src/Analyser');

describe('Analyser Class', () => {
  describe('Create and getData back', () => {
    it('should return an instance of Main Class', () => {
      const analyser = new Analyser({
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)',
      });
      expect(analyser).to.be.instanceOf(Analyser);

      analyser.analyse();

      expect(analyser.getData()).to.be.instanceOf(Main);
    });
  });

  describe('create and setData ', () => {
    it('getData should return an instance of Main Class', () => {
      const analyser = new Analyser({
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; InfoPath.1)',
      });
      expect(analyser).to.be.instanceOf(Analyser);

      const input = new Main();

      expect(input).to.be.instanceOf(Main);

      analyser.setData(input);
      analyser.analyse();

      expect(analyser.getData()).to.be.instanceOf(Main);
    });
  });
});
