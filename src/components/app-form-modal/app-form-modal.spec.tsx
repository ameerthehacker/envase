import React, { ReactNode } from 'react';
import { render, fireEvent, waitFor } from '../../../tests/test-util';
import AppFormModal from './app-form-modal';
import { FORMULA } from '../../../tests/fixtures/app.fixture';
import { AppStatusProvider } from '../../contexts/app-status/app-status';

jest.mock('../../services/native/native', () => ({
  ipcRenderer: {
    on: () => null,
    send: () => null,
    removeListener: () => null
  }
}));

const renderWithAppStatusProvider = (children: ReactNode) =>
  render(<AppStatusProvider>{children}</AppStatusProvider>);

describe('AppFormModal', () => {
  it('should render the heading', async () => {
    const { getByText } = renderWithAppStatusProvider(
      <AppFormModal
        onSubmit={() => null}
        isOpen={true}
        onClose={() => null}
        app={FORMULA}
      />
    );

    await waitFor(() =>
      expect(getByText('Create MySQL App').tagName).toBe('HEADER')
    );
  });

  it('should call onClose when cancel is clicked', async () => {
    const onClose = jest.fn();
    const { getByText } = renderWithAppStatusProvider(
      <AppFormModal
        onSubmit={() => null}
        isOpen={true}
        onClose={onClose}
        app={FORMULA}
      />
    );
    const btnCancel = getByText('Cancel');

    fireEvent.click(btnCancel);

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
});
