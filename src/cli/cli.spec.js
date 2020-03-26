const { version } = require('../../package.json');
const { cmdVersion, cmdListFormulas, cmdNewApp } = require('./cli');
const { red } = require('chalk');
const { isFormulaFound } = require('../util/util');

jest.mock('../util/util', () => ({
  readAllFormulas() {
    return ['mysql', 'hasura'];
  },
  isFormulaFound: jest.fn()
}));

describe('cmd()', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    console.log = jest.fn();
  });

  it('cmdVersion() should print package version for --version option', () => {
    cmdVersion();

    expect(console.log).toHaveBeenCalledWith(version);
  });

  it('cmdListFormulas() should print the available formulas', () => {
    cmdListFormulas();

    expect(console.log).toHaveBeenCalledWith('mysql\nhasura');
  });

  describe('cmdNewApp()', () => {
    it('should print error when no name given', () => {
      console.log = jest.fn();

      cmdNewApp();

      expect(console.log).toHaveBeenCalledWith(
        red('no app name was given, eg. mysql, redis')
      );
    });

    it('should print error when the app is not found', () => {
      isFormulaFound.mockReturnValue(false);
      console.log = jest.fn();

      cmdNewApp('mysql');

      expect(console.log).toHaveBeenLastCalledWith(
        red(`app 'mysql' was not found`)
      );
    });
  });
});
