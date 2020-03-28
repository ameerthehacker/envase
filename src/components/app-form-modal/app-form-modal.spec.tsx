import React from 'react';
import { render, fireEvent } from '../../../tests/test-util';
import AppFormModal from './app-form-modal';
import { FORMULA } from '../../../tests/fixtures/app.fixture';

describe('AppFormModal', () => {
  it('should render the heading', () => {
    const { getByText } = render(
      <AppFormModal isOpen={true} onClose={() => null} app={FORMULA} />
    );

    expect(getByText('Create MySQL App').tagName).toBe('HEADER');
  });

  it('should call onClose when cancel is clicked', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <AppFormModal isOpen={true} onClose={onClose} app={FORMULA} />
    );
    const btnCancel = getByText('Cancel');

    fireEvent.click(btnCancel);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
