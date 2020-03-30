import React from 'react';
import AppCard from './app-card';
import { render, fireEvent } from '../../../tests/test-util';

it('should call onCreateClick() when create is clicked', () => {
  const onCreateClick = jest.fn();
  const { getByText } = render(
    <AppCard name="mysql" logo="logo-url" onCreateClick={onCreateClick} />
  );
  const btnCreate = getByText('Create');

  fireEvent.click(btnCreate);

  expect(onCreateClick).toHaveBeenCalledTimes(1);
});
