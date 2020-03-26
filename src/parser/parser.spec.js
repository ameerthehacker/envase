const {
  validate,
  interpolate,
  toEnquirerJSON,
  getEnquirerType
} = require('./parser');

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

  it('getEnquirerType() should return correct enquirer types', () => {
    expect(getEnquirerType('string')).toBe('input');
    expect(getEnquirerType('password')).toBe('password');
    expect(getEnquirerType('number')).toBe('input');
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

describe('toEnquirerJSON()', () => {
  it('should convert string', () => {
    expect(
      toEnquirerJSON({
        data: {
          name: {
            type: 'string',
            description: 'Name of the MySQL server instance',
            required: true
          }
        }
      })
    ).toEqual([
      {
        type: 'input',
        name: 'name',
        required: true,
        message: 'Name of the MySQL server instance'
      }
    ]);
  });
});
