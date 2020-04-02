import { capitalize, interpolate, getDockerHubLinkToTags } from './utils';

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

  it('getDockerHubLink() should return link for official images', () => {
    expect(getDockerHubLinkToTags('library/node')).toBe(
      'https://hub.docker.com/_/node/?tab=tags'
    );
  });

  it('getDockerHubLink() should return link for non official images', () => {
    expect(getDockerHubLinkToTags('ameerthehacker/node')).toBe(
      'https://hub.docker.com/r/ameerthehacker/node/tags'
    );
  });
});
