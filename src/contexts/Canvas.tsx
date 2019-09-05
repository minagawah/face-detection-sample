/**
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';

const print = (s = '') => console.log(`[useCanvas] ${s}`);

export interface HTMLCanvasState {
  test: boolean;
}

export const useCanvas = (el: React.ReactElement<HTMLCanvasElement>): [
  React.ReactElement<HTMLCanvasElement>,
  HTMLCanvasState,
  { current: HTMLCanvasElement | null }
] => {
  const [state, setState] = useState<HTMLCanvasState>({
    test: false,
  });
  const ref = useRef<HTMLCanvasElement | null>(null);
  let props: HTMLCanvasElement = el.props;
  
  // @todo
  // Coundn't add `ref` to the element....
  // So, declare the element as `{} as any`.
  // --------------------------------------------------------------------------
  // Argument of type '{ ref: MutableRefObject<HTMLCanvasElement | null>; height: number; width: number; getContext(contextId: "2d", options?: CanvasRenderingContext2DSettings | undefined): CanvasRenderingContext2D | null; getContext(contextId: "bitmaprenderer", options?: ImageBitmapRenderingContextSettings | undefined): ImageBitmapRender...' is not assignable to parameter of type 'Partial<HTMLCanvasElement> & Attributes'.
  // Object literal may only specify known properties, and 'ref' does not exist in type 'Partial<HTMLCanvasElement> & Attributes'.  TS2769
  // --------------------------------------------------------------------------
  const element: React.ReactElement<any> | undefined = React.cloneElement(el, {
    ...props,
    ref,
  } as any);
  
  return [element, state, ref];
};
