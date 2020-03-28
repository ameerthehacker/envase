import React from 'react';
import { render } from '../../../tests/test-util';
import EmptyState from './empty-state';
import { fireEvent } from '@testing-library/react';

describe('EmptyState', () => {
  it('should show no apps are available', () => {
    const { getByText } = render(
      <EmptyState onCreateClick={() => null} height="100vh" />
    );

    expect(getByText('No apps available!')).toBeTruthy();
  });

  it('should trigger the callback when create is clicked', () => {
    const onCreateClick = jest.fn();
    const { getByText } = render(
      <EmptyState onCreateClick={onCreateClick} height="100vh" />
    );
    const btnCreate = getByText('Create');

    fireEvent.click(btnCreate);

    expect(onCreateClick).toHaveBeenCalledTimes(1);
  });
});
