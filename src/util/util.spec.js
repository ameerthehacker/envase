const fs = require('fs');
const { readAllFormulas, getFilenameWithoutExt } = require('./util');

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
});
