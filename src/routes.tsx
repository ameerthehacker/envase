import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import App from './screens/app/app';
import ShellIntoApp from './screens/shell-into-app/shell-into-app';
import { Global, css } from '@emotion/react';
import { useColorMode, useTheme } from '@chakra-ui/react';

export default function Routes() {
  const { colorMode } = useColorMode();
  const theme = useTheme();

  return (
    <HashRouter>
      <Global
        styles={css`
          ::-webkit-scrollbar-track {
            background-color: ${colorMode === 'dark'
              ? theme.colors.gray[800]
              : 'white'};
          }

          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
            position: absolute;
          }

          ::-webkit-scrollbar-thumb {
            background-color: ${colorMode === 'dark'
              ? theme.colors.gray[300]
              : theme.colors.gray[500]};
            border-radius: 5px;
          }
        `}
      />
      <Route path="/" exact>
        <App />
      </Route>
      <Route path="/shell/:containerId" exact>
        <ShellIntoApp />
      </Route>
    </HashRouter>
  );
}
