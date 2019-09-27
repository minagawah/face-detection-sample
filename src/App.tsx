import React from 'react';
import { css } from '@emotion/core';
import { Route, Switch } from 'react-router-dom';

import { Header } from './components/';
import { Home, Face } from './pages';

export const App: React.FC = () => {
  return (
    <div>
      <Header />
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
