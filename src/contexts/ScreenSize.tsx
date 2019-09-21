/**
 * Listens to `resize` and updates screen `width` and `height`.
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useContext, createContext, useCallback } from 'react';
import { useEvent } from 'react-use';

const print = (s = '') => console.log(`[ScreenSize] ${s}`);

const ScreenSizeContext: any = createContext({});

export const ScreenSizeProvider = ScreenSizeContext.Provider;

export type ScreenSizeType = {
  width?: number
  height?: number
} & unknown

export const getSize = (): ScreenSizeType => ({
  width: window.innerWidth || 0,
  height: window.innerHeight || 0,
});

const initialScreenSize: ScreenSizeType = getSize();

export const useScreenSizeProvider = () => {
  const [size, setSize] = useState(initialScreenSize);

  const resize = useCallback(() => {
    setSize(getSize());
  }, [setSize]);

  useEvent('resize', resize);

  return {
    size,
  };
}

export const ProvideScreenSize: React.FC = (args: any) => {
  const { children }: { children: any} = args || {};
  const props = useScreenSizeProvider();
  return (
    <ScreenSizeContext.Provider value={props}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

export const useScreenSize: Function = () => {
  return useContext(ScreenSizeContext);
};
