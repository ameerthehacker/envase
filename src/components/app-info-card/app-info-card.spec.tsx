import React from 'react';
import AppInfoCard from './app-info-card';
import { render } from '../../../tests/test-util';

describe('AppCard', () => {
  it('should render the logo image', async () => {
    const { getByAltText } = render(
      <AppInfoCard name="mysql" logo="logo-url" />
    );

    const image = getByAltText('app-logo');

    expect(image.getAttribute('src')).toBe('logo-url');
  });

  it('should render the app name', () => {
    const { getByText } = render(<AppInfoCard name="mysql" logo="logo-url" />);

    expect(getByText('mysql')).toBeTruthy();
  });
});
