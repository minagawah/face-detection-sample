import React, { useEffect, useCallback } from 'react';
import { useDebounce } from 'react-use';
import styled from '@emotion/styled';
import { useScreenSize } from './contexts/ScreenSize';

const print: Function = (s: string): void => console.log(`[Home] ${s}`);

const Wrapper = styled.div`
`;

export const Home: React.FC = () => {
  const screensize: any = useScreenSize();

  const resize = useCallback(() => {
    const screen_w = screensize.size.width;
    const screen_h = screensize.size.height;
    print(`screen: ${screen_w}x${screen_h}`);
  }, [screensize.size]);

  useDebounce(resize, 1000, [screensize.size]);

  useEffect(() => {
    resize();
  }, [resize]);

  return (
    <Wrapper>
      Home
    </Wrapper>
  );
}
