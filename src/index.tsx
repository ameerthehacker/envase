import React from 'react';
import ReactDOM from 'react-dom';
import App from './screens/app/app';
import { ThemeProvider, ColorModeProvider, CSSReset } from '@chakra-ui/core';

ReactDOM.render(
  <ThemeProvider>
    <ColorModeProvider>
      <CSSReset />
      <App />
    </ColorModeProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
