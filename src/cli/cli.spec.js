const { version } = require('../../package.json');
const { cmdVersion, cmdListFormulas } = require('./cli');

jest.mock('../parser/parser', () => ({
  readAllFormulas() {
    return ['mysql', 'hasura'];
  }
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
});
