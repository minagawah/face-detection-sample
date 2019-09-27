import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { composeContextProviders } from './lib/utils';
import { ProvideScreenSize } from './contexts/';
import { App } from './App';
import './index.css';

import * as serviceWorker from './serviceWorker';

type AppliedContext = (React.FC | any)[];
type AppliedContextList = AppliedContext[];

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    {composeContextProviders( // Apply multiple contexts.
      [
        [(ProvideScreenSize as React.FC), {}]
      ] as AppliedContextList,
      (
        <App />
      )
    )}
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
