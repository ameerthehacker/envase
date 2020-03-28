import React from 'react';
import AppCard from './app-card';
import { render, fireEvent } from '../../../tests/test-util';

describe('AppCard', () => {
  it('should render the logo image', async () => {
    const { getByAltText } = render(
      <AppCard name="mysql" logo="logo-url" onCreateClick={() => null} />
    );

    const image = getByAltText('app-logo');

    expect(image.getAttribute('src')).toBe('logo-url');
  });

  it('should render the app name', () => {
    const { getByText } = render(
      <AppCard name="mysql" logo="logo-url" onCreateClick={() => null} />
    );

    expect(getByText('mysql')).toBeTruthy();
  });

  it('should call onCreateClick() when create is clicked', () => {
    const onCreateClick = jest.fn();
    const { getByText } = render(
      <AppCard name="mysql" logo="logo-url" onCreateClick={onCreateClick} />
    );
    const btnCreate = getByText('Create');

    fireEvent.click(btnCreate);

    expect(onCreateClick).toHaveBeenCalledTimes(1);
  });
});
