import React from 'react';
import AppCard from './app-card';
import { render } from '@testing-library/react';

describe('AppCard', () => {
  it('should render the logo image', async () => {
    const { getByAltText } = render(<AppCard name="mysql" logo="logo-url" />);

    const image = getByAltText('app-logo');

    expect(image.getAttribute('src')).toBe('logo-url');
  });

  it('should render the app name', () => {
    const { getByText } = render(<AppCard name="mysql" logo="logo-url" />);

    expect(getByText('mysql')).toBeTruthy();
  });
});
