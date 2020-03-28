import React from 'react';
import { render } from '../../test-util';
import AppForm from './app-form';
import { FORMULA } from './app.fixture';

describe('AppForm', () => {
  it('should render a input box', () => {
    const { getByLabelText } = render(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            name: {
              description: 'Name of the MySQL instance',
              type: 'string'
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
    const { getByLabelText } = render(
      <AppForm
        app={{
          ...FORMULA,
          data: {
            name: {
              description: 'Name of the MySQL instance',
              type: 'password'
            }
          }
        }}
      />
    );

    const input = getByLabelText('Name');

    expect(input.getAttribute('placeholder')).toBe(
      'Name of the MySQL instance'
    );
    expect(input.getAttribute('type')).toBe('password');
  });
});
