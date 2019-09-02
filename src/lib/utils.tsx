import React from 'react';

export type ContextProvidersContextsType = any[];

type composeContextProvidersType = (ContextProvidersContextsType, any) => any;

export const composeContextProviders: composeContextProvidersType =
  (contexts: ContextProvidersContextsType, component: any) => (
    contexts.reduce((acc, [Provider, value]) => {
      return (
        <Provider value={value}>{acc}</Provider>
      );
    }, component)
  );
