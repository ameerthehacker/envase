import { interpolate } from './parser';

describe('interpolate()', () => {
  expect(
    interpolate('%password%-%password%', { password: 'secret-password' })
  ).toBe('secret-password-secret-password');
});
