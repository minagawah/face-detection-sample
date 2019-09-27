/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { css } from '@emotion/core';
import { BrowserRouter as Router } from 'react-router-dom';
import tw from 'tailwind.macro';

import { composeContextProviders } from './lib/utils';
import { ProvideScreenSize } from './contexts/ScreenSize';
import { App } from './containers/';
import './index.css';

import * as serviceWorker from './serviceWorker';

type AppliedContext = (React.FC | any)[];
type AppliedContextList = AppliedContext[];

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    {composeContextProviders(
      // Specify multiple contexts you want
      // to applyto the child components.
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
