import { interpolate } from './parser';

describe('interpolate()', () => {
  it('should interpolate variables', () => {
    expect(
      interpolate('%password%-%password%', { password: 'secret-password' })
    ).toBe('secret-password-secret-password');
  });
});
