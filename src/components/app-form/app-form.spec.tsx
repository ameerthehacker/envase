import React, { ReactElement } from 'react';
import { render } from '../../../tests/test-util';
import AppForm from './app-form';
import { FORMULA } from '../../../tests/fixtures/app.fixture';
import { Formik } from 'formik';

jest.mock('../../services/native', () => ({
  ipcRenderer: {
    on: () => null,
    send: () => null,
    removeListener: () => null
  }
}));

const renderWitFormik = (children: ReactElement, initialValues: any = {}) =>
  render(
    /* eslint-disable @typescript-eslint/no-empty-function */
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {children}
    </Formik>
  );

describe('AppForm', () => {
  it('should render a input box', () => {
    const { getByLabelText } = renderWitFormik(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            name: {
              description: 'Name of the MySQL instance',
              type: 'string',
              required: true
            }
          }
        }}
      />
    );

    const input = getByLabelText('Name');

    expect(input.getAttribute('placeholder')).toBe(
      'Name of the MySQL instance'
    );
    expect(input.getAttribute('type')).toBe('text');
  });

  it('should render a dropdown', () => {
    const { getByLabelText } = renderWitFormik(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            auth: {
              description: 'Allow auth',
              type: 'option',
              options: ['yes', 'no'],
              required: true
            }
          }
        }}
      />
    );

    const select = getByLabelText('Auth') as HTMLSelectElement;
    const options = select.getElementsByTagName('option');

    expect(options.item(0)?.text).toBe('Allow auth');
    expect(options.item(1)?.text).toBe('yes');
    expect(options.item(2)?.text).toBe('no');
  });

  it('should render a password box', () => {
    const { getByLabelText } = renderWitFormik(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            password: {
              description: 'Password for root user',
              type: 'password',
              required: true
            }
          }
        }}
      />
    );

    const input = getByLabelText('Password');

    expect(input.getAttribute('placeholder')).toBe('Password for root user');
    expect(input.getAttribute('type')).toBe('password');
  });

  it('should say optional in placeholder when it is not required', () => {
    const { getByLabelText } = renderWitFormik(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            password: {
              description: 'Password for root user',
              type: 'password',
              required: false
            }
          }
        }}
      />
    );

    const input = getByLabelText('Password');

    expect(input.getAttribute('placeholder')).toBe(
      'Password for root user (optional)'
    );
  });
});
