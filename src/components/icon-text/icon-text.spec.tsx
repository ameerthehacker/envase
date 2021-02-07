import React from 'react';
import { render } from '../../../tests/test-util';
import { IconText } from './icon-text';
import { Box } from '@chakra-ui/react';

describe('IconText', () => {
  it('should render the text', () => {
    const { getByText } = render(<IconText icon={<Box />} text="some-text" />);

    expect(getByText('some-text')).toBeTruthy();
  });
});
