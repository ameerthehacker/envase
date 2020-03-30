import { capitalize, interpolate } from './utils';

describe('utils', () => {
  it('capitalize() should capitalize the string', () => {
    expect(capitalize('name')).toBe('Name');
    expect(capitalize('')).toBe('');
  });

  it('interpolate() should interpolate variables', () => {
    expect(
      interpolate('%password%-%password%', { password: 'secret-password' })
    ).toBe('secret-password-secret-password');
  });
});
