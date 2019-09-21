import React from 'react';

export type ContextProvidersContextsType = any[];

export const composeContextProviders =
  (contexts: ContextProvidersContextsType, component: any) => {
    return contexts.reduce((acc, [Provider, value]) => {
      return (
        <Provider value={value}>{acc}</Provider>
      );
    }, component);
  };
