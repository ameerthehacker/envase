import { capitalize } from './utils';

describe('utils', () => {
  it('capitalize() should capitalize the string', () => {
    expect(capitalize('name')).toBe('Name');
    expect(capitalize('')).toBe('');
  });
});
