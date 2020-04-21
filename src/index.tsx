import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { AppStatusProvider } from './contexts/app-status/app-status';
import UnhandledError from './components/unhandled-error/unhandled-error';
import Routes from './routes';
import './index.css';

ReactDOM.render(
  <ThemeProvider>
    <ColorModeProvider>
      <CSSReset />
      <UnhandledError>
        <AppStatusProvider>
          <Routes />
        </AppStatusProvider>
      </UnhandledError>
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
