import React from 'react';
import { Route, HashRouter } from 'react-router-dom';
import App from './screens/app/app';
import ShellIntoApp from './screens/shell-into-app/shell-into-app';

export default function Routes() {
  return (
    <HashRouter>
      <Route path="/" exact>
        <App />
      </Route>
      <Route path="/shell/:containerId" exact>
        <ShellIntoApp />
      </Route>
    </HashRouter>
  );
}
