import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './screens/app/app';
import ShellIntoApp from './screens/shell-into-app/shell-into-app';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact>
        <App />
      </Route>
      <Route path="/shell/:containerId" exact>
        <ShellIntoApp />
      </Route>
    </BrowserRouter>
  );
}
