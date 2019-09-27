import React from 'react';
import { Link } from 'react-router-dom';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import tw from 'tailwind.macro';

// const print: Function = (s: string): void => console.log(`[Header] ${s}`);

import logo from '../logo.svg';

const NavLink = styled(Link)`
  color: #61dafb;
  &:hover {
    color: #b4efff;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Header: React.FC = () => {
  return (
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
      <div css={css`
width: calc(100vw - 65px);
${tw`flex flex-row justify-center content-center items-center`}
      `}>
        <NavLink to="/home">[ Home ]</NavLink>
        <NavLink to="/face">[ Face ]</NavLink>
      </div>
    </header>
  );
}
