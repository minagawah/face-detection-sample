/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { css, keyframes } from '@emotion/core';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import tw from 'tailwind.macro';

import { composeContextProviders } from './lib/utils';
import { ProvideScreenSize } from './contexts/ScreenSize';
import { Nav } from './Nav';
import { Home } from './Home';
import { Face } from './Face';

import logo from './logo.svg';
import './index.css';

import * as serviceWorker from './serviceWorker';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

ReactDOM.render(
  <Router basename={process.env.PUBLIC_URL}>
    {composeContextProviders(
      [
        [(ProvideScreenSize as React.FC), {}]
      ],
      (
        <div>
          <header css={css`
background-color: #282c34;
font-size: 1.2em;
color: white;
padding: 0.2em;
${tw`flex flex-col justify-center content-center items-center`}
          `}>
            <img css={css`
animation: ${spin} infinite 20s linear;
height: 10vmin;
pointer-events: none;
            `} src={logo} alt="logo" />
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
