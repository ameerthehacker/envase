import React, { ReactElement } from 'react';
import { render } from '../../../tests/test-util';
import AppForm from './app-form';
import { FORMULA } from '../../../tests/fixtures/app.fixture';
import { Formik } from 'formik';

const renderWitFormik = (children: ReactElement) =>
  render(
    /* eslint-disable @typescript-eslint/no-empty-function */
    <Formik initialValues={{}} onSubmit={() => {}}>
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
