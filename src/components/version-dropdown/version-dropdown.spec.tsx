import React from 'react';
import { render, waitFor } from '../../../tests/test-util';
import { Formik, Field, Form } from 'formik';
import VersionDropdown, { GetImageTagsResponse } from './version-dropdown';
import { ipcRenderer } from '../../services/native';
import userEvent from '@testing-library/user-event';

jest.mock('../../services/native', () => ({
  ipcRenderer: {
    removeListener: () => null
  }
}));

describe('VersionDropdown', () => {
  it('should suggest image tags/version', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    ipcRenderer.on = jest
      .fn()
      .mockImplementation(
        (
          channel: string,
          cb: (evt: any, res: GetImageTagsResponse) => void
        ) => {
          ipcRenderer.send = jest
            .fn()
            .mockImplementationOnce(() => {
              cb(null, {
                error: false,
                res: {
                  results: [
                    { name: 'tag-1' },
                    { name: 'tag-2' },
                    { name: 'latest' }
                  ],
                  next: 'http://next-url'
                }
              });
            })
            .mockImplementationOnce(() => {
              cb(null, {
                error: false,
                res: {
                  results: [{ name: 'tag-3' }],
                  next: null
                }
              });
            });
        }
      );

    const { getByPlaceholderText, getByText } = render(
      /* eslint-disable @typescript-eslint/no-empty-function */
      <Formik initialValues={{ version: '' }} onSubmit={() => {}}>
        <Form>
          <Field name="version">
            {({ field, form }: { field: any; form: any }) => (
              <VersionDropdown
                image="some-image"
                alwaysShowSuggestions={true}
                placeholder="select a tag/version"
                field={field}
                form={form}
              />
            )}
          </Field>
        </Form>
      </Formik>
    );

    const inputField = getByPlaceholderText('select a tag/version');

    userEvent.type(inputField, 'tag');

    await waitFor(() => {
      expect(getByText('tag-1')).toBeTruthy();
      expect(getByText('tag-2')).toBeTruthy();
      expect(getByText('tag-3')).toBeTruthy();
    });
  });
});
