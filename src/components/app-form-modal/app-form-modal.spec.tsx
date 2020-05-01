import React from 'react';
import { render, fireEvent, waitFor } from '../../../tests/test-util';
import AppFormModal from './app-form-modal';
import { FORMULA } from '../../../tests/fixtures/app.fixture';

jest.mock('../../services/native/native', () => ({
  ipcRenderer: {
    on: () => null,
    send: () => null,
    removeListener: () => null
  }
}));

describe('AppFormModal', () => {
  it('should render the heading', async () => {
    const { getByText } = render(
      <AppFormModal isOpen={true} onClose={() => null} app={FORMULA} />
    );

    await waitFor(() =>
      expect(getByText('Create MySQL App').tagName).toBe('HEADER')
    );
  });

  it('should call onClose when cancel is clicked', async () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <AppFormModal isOpen={true} onClose={onClose} app={FORMULA} />
    );
    const btnCancel = getByText('Cancel');

    fireEvent.click(btnCancel);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
