import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AppStatusProvider } from './contexts/app-status/app-status';
import UnhandledError from './components/unhandled-error/unhandled-error';
import Routes from './routes';
import './index.css';

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode="dark" />
    <UnhandledError>
      <AppStatusProvider>
        <ChakraProvider>
          <Routes />
        </ChakraProvider>
      </AppStatusProvider>
    </UnhandledError>
  </>,
  document.getElementById('root')
);
