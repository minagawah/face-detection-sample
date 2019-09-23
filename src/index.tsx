/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { css, keyframes } from '@emotion/core';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { composeContextProviders } from './lib/utils';
import { ProvideScreenSize } from './contexts/ScreenSize';
import { Nav } from './Nav';
import { Home } from './Home';
import { Face } from './Face';

import logo from './logo.svg';
import './index.css';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    {composeContextProviders(
      [
        [(ProvideScreenSize as React.FC), {}]
      ],
      (
        <div>
          <header className="header">
            <img src={logo} className="logo" alt="logo" />
            <Nav />
          </header>
          <div css={css`margin-top:0.4em;`}>
            <Switch>
              <Route exact path="/" component={Face} />
              <Route path="/home" component={Home} />
              <Route path="/face" component={Face} />
            </Switch>
          </div>
        </div>
      )
    )}
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
