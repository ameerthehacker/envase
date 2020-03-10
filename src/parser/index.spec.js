const { validate, interpolate, readAllFormulas } = require('./index');
const fs = require('fs');

describe('validate()', () => {
  it('should throw if image field is empty', () => {
    expect(() => validate('mysql', {})).toThrowError(
      'mysql has no docker image specified'
    );
    expect(() => validate('mysql', { image: ' ' })).toThrow(
      'mysql has no docker image specified'
    );
  });

  it('should throw when the image field is not string', () => {
    expect(() => validate('mysql', { image: {} })).toThrowError(
      'mysql: image property must be a string'
    );
  });

  it('should throw when data has no type property', () => {
    expect(() => {
      validate('mysql', {
        image: 'mysql',
        data: {
          name: {}
        }
      });
    }).toThrowError('mysql: field `name` has no type property');
  });

  it('should throw when the data property is not object', () => {
    expect(() => {
      validate('mysql', {
        image: 'mysql',
        data: 'string-data'
      });
    }).toThrow('mysql: data proprty must be an object');
  });

  it('should throw when unknown type is given', () => {
    expect(() => {
      validate('mysql', {
        image: 'mysql',
        data: {
          password: {
            type: 'unknown'
          }
        }
      });
    }).toThrow('mysql: field `password` has unknown type `unknown`');
  });
});

describe('interpolate()', () => {
  expect(
    interpolate('%password%-%password%', { password: 'secret-password' })
  ).toBe('secret-password-secret-password');
});

describe('readAllFormulas()', () => {
  const formulas = ['mysql', 'hasura'];

  fs.readdirSync = jest.fn().mockImplementation(() => {
    return formulas;
  });

  expect(readAllFormulas()).toEqual(formulas);
});
