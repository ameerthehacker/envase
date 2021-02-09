import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AppStatusProvider } from './contexts/app-status/app-status';
import UnhandledError from './components/unhandled-error/unhandled-error';
import Routes from './routes';
import './index.css';
import ReactGA from 'react-ga';

if (process.env.REACT_APP_GA_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_ID, {
    debug: process.env.NODE_ENV === 'development',
    gaOptions:
      process.env.NODE_ENV === 'development'
        ? {
            siteSpeedSampleRate: 100
          }
        : {}
  });
  ReactGA.pageview(window.location.href);
}

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode="system" />
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
