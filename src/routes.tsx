import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './screens/app/app';
import Shell from './screens/shell/shell';

export default function Routes() {
  return (
    <BrowserRouter>
      <Route path="/" exact>
        <App />
      </Route>
      <Route path="/shell/:containerId" exact>
        <Shell />
      </Route>
    </BrowserRouter>
  );
}
