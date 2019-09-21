import React from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import tw from 'tailwind.macro';

// const print: Function = (s: string): void => console.log(`[Nav] ${s}`);

const NavLink = styled(Link)`
  color: #61dafb;
  &:hover {
    color: #b4efff;
  }
`;

export const Nav: React.FC = () => {
  return (
    <div css={css`
width: calc(100vw - 65px);
${tw`flex flex-row justify-center content-center items-center`}
    `}>
      <NavLink to="/home">[ Home ]</NavLink>
      <NavLink to="/face">[ Face ]</NavLink>
    </div>
  );
}
