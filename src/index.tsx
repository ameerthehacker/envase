import React from 'react';
import ReactDOM from 'react-dom';
import App from './screens/app/app';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { AppStatusProvider } from './contexts/app-status/app-status';
import UnhandledError from './components/unhandled-error/unhandled-error';

ReactDOM.render(
  <ThemeProvider>
    <ColorModeProvider>
      <CSSReset />
      <UnhandledError>
        <AppStatusProvider>
          <App />
        </AppStatusProvider>
      </UnhandledError>
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
