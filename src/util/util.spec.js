const fs = require('fs');
const { readAllFormulas } = require('./util');

describe('readAllFormulas()', () => {
  it('should return all the formulas', () => {
    const formulas = ['mysql', 'hasura'];

    fs.readdirSync = jest.fn().mockImplementation(() => {
      return formulas;
    });

    expect(readAllFormulas()).toEqual(formulas);
  });
});
