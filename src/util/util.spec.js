const fs = require('fs');
const {
  readAllFormulas,
  getFilenameWithoutExt,
  isFormulaFound
} = require('./util');

describe('util', () => {
  it('readAllFormulas() should return all the formulas', () => {
    fs.readdirSync = jest.fn().mockImplementation(() => {
      return ['mysql.js', 'hasura.js'];
    });

    expect(readAllFormulas()).toEqual(['mysql', 'hasura']);
  });

  it('getFilenameWithoutExt() should return filename without extension', () => {
    expect(getFilenameWithoutExt('mysql.js')).toBe('mysql');
    expect(getFilenameWithoutExt('mysql')).toBe('mysql');
  });

  it('isFormulaPresent() should return false when formula does not exists', () => {
    fs.existsSync = jest.fn().mockReturnValue(false);

    expect(isFormulaFound('some-formula')).toBeFalsy();
  });

  it('isFormulaPresent() should return true when formula exists', () => {
    fs.existsSync = jest.fn().mockReturnValue(true);

    expect(isFormulaFound('some-formula')).toBeTruthy();
  });
});
