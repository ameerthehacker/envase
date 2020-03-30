import React from 'react';
import { render, fireEvent, waitFor } from '../../../tests/test-util';
import { Formik, Field, Form } from 'formik';
import FolderPicker, { OpenFolderDialogResult } from './folder-picker';
import { ipcRenderer } from '../../services/native';

jest.mock('../../services/native', () => ({
  ipcRenderer: {
    removeListener: () => null
  }
}));

describe('FolderPicker', () => {
  it('should fill the selected path', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ipcRenderer.on = jest
      .fn()
      .mockImplementation(
        (
          channel: string,
          cb: (evt: any, res: OpenFolderDialogResult) => void
        ) => {
          ipcRenderer.send = jest.fn().mockImplementation(() => {
            cb(null, { error: false, selectedPath: 'my-path' });
          });
        }
      );

    const { getByPlaceholderText, getByLabelText } = render(
      /* eslint-disable @typescript-eslint/no-empty-function */
      <Formik initialValues={{ data: '' }} onSubmit={() => {}}>
        <Form>
          <Field name="data">
            {({ field, form }: { field: any; form: any }) => (
              <FolderPicker placeholder="select a path" {...field} {...form} />
            )}
          </Field>
        </Form>
      </Formik>
    );

    const inputField = getByPlaceholderText('select a path');
    const btnBrowse = getByLabelText('browse-folder');

    fireEvent.click(btnBrowse);

    waitFor(() => expect(inputField).toHaveValue('my-path'));
  });
});
