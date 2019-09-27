import React from 'react';
import { css, keyframes } from '@emotion/core';
import { Route, Switch } from 'react-router-dom';
import tw from 'tailwind.macro';

import { Nav } from './components/';
import { Home, Face } from './pages';

import logo from './logo.svg';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const App: React.FC = () => {
  return (
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
  );
};
