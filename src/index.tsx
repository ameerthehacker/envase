import React from 'react';
import ReactDOM from 'react-dom';
import App from './screens/app/app';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';
import { AppStatusProvider } from './contexts/app-status/app-status';

ReactDOM.render(
  <ThemeProvider>
    <ColorModeProvider>
      <CSSReset />
      <AppStatusProvider>
        <App />
      </AppStatusProvider>
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
