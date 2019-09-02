/**
 * Listens to `resize` and updates screen `width` and `height`.
 */
import React, { useState, useContext, createContext, useCallback } from 'react';
import { useEventListener } from './EventListener';

const print = (s = '') => console.log(`[ScreenSize] ${s}`);

const ScreenSizeContext: any = createContext({});

const getSize = () => ({
  width: window.innerWidth || 0,
  height: window.innerHeight || 0,
});

const useScreenSizeProvider = () => {
  const [size, setSize] = useState(getSize());

  const handler = useCallback(() => {
    setSize(getSize());
  }, [setSize]);

  useEventListener('resize', handler);

  return {
    size,
  };
}

export const ScreenSizeProvider: React.FC = ({ children }) => {
  const ss = useScreenSizeProvider();
  return (
    <ScreenSizeContext.Provider value={ss}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

// function useContext<T>(context: Context<T>): T;

// export interface ContextType<T> {
//   Provider: Provider<T>;
//   Consumer: Consumer<T>;
//   displayName?: string;
// }

export const useScreenSize: Function = () => {
  return useContext(ScreenSizeContext);
};
