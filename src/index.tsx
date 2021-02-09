import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AppStatusProvider } from './contexts/app-status/app-status';
import UnhandledError from './components/unhandled-error/unhandled-error';
import Routes from './routes';
import './index.css';
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { name, version } from '../package.json';

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

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
    release: `${name}@${version}`
  });
}

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode="system" />
    <Sentry.ErrorBoundary fallback={UnhandledError}>
      <AppStatusProvider>
        <ChakraProvider>
          <Routes />
        </ChakraProvider>
      </AppStatusProvider>
    </Sentry.ErrorBoundary>
  </>,
  document.getElementById('root')
);
