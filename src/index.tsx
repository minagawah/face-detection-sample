import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import {
  ContextProvidersContextsType,
  composeContextProviders,
} from './lib/utils';
import { ScreenSizeProvider } from './contexts/ScreenSize';

import App from './App';
import { Face } from './components/Face';

import 'normalize.css';
import './index.css';

import * as serviceWorker from './serviceWorker';

const contextProviders: ContextProvidersContextsType = [
  [
    (ScreenSizeProvider as React.FC), { width: 0, height: 0 }
  ]
];

const component: any = (
  <div className="wrapper">
    <Route path="/" component={App} />
    <Route path="/face" component={Face} />
  </div>
);

ReactDOM.render(
  <Router>
    {composeContextProviders(contextProviders, component)}
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
