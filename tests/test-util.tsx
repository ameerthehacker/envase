import React, { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const customRender = (ui: ReactElement, options: any = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
