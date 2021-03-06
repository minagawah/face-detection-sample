/**
 * Face Detection API
 */
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useState, useCallback, RefObject, MutableRefObject } from 'react';
import { compose, apply } from 'ramda';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import tw from 'tailwind.macro';
import { useVideo } from 'react-use';
import { faceDetect } from '../lib/';
import { useScreenSize, getScreenSize, ScreenSizeStateType } from '../contexts/';
import { useCanvas, useDebounceWrapper, useLooper } from '../hooks/';

import './Face.css';

const int = Math.trunc;
const print: Function = (s: string): void => console.log(`[Face] ${s}`);

const RATIO = 16 / 9;

const enumerateDevices = async (): Promise<any[] | any | unknown> => {
  if (!('mediaDevices' in navigator)) {
    throw new Error('No support for media handling (navigator.mediaDevices)');
  }
  if (typeof navigator.mediaDevices.enumerateDevices !== 'function') {
    throw new Error('No support for video streaming (navigator.mediaDevices.enumerateDevices)');
  }
  try {
    return await navigator.mediaDevices.enumerateDevices();
  } catch (err) {
    console.error('Failed: navigator.mediaDevices.enumerateDevices');
    throw err;
  }
};

const getUserMedia = async (options = {}): Promise<any> => {
  if (!('mediaDevices' in navigator)) {
    throw new Error('No support for media handling (navigator.mediaDevices)');
  }
  if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
    throw new Error('No support for video streaming (navigator.mediaDevices.getUserMedia)');
  }
  try {
    return await navigator.mediaDevices.getUserMedia(options);
  } catch (err) {
    console.error('Failed: navigator.mediaDevices.getUserMedia');
    throw err;
  }
};

const calculateMediaSize = (size: ScreenSizeStateType) => {
  const { width: screen_w = 0, height: screen_h = 0 } = size || {};
  const avail = screen_h * 0.7;
  const height = int(avail / 2);
  const width = int(height * RATIO);
  return { width, height };
};

export const Face: React.FC = (props) => {
  const { screenSize } = useScreenSize();

  const [video, videoState, videoControls, videoRef] = useVideo(
    <video css={tw`bg-black`} autoPlay />
  );
  
  const [canvas, canvasState, canvasRef] = useCanvas(
    <canvas css={tw`bg-black`} />
  );

  type MediaSizeType = {
    width?: number
    height?: number
  } & unknown;

  const [ready, setReady] = useState(false);
  const [mediaSize, setMediaSize] = useState(calculateMediaSize(screenSize));
  const [btnName, setBtnName] = useState('Play');
  const [toggleBtnClass, setToggleBtnClass] = useState('face-btn');
  const [message, setMessage] = useState('');
  
  // R.apply converts an array to arguments object, and applies the function given.
  // <L extends any[]>(f: Function) => (args: L) => f(...args: L)
  const resize = apply(compose(setMediaSize, calculateMediaSize));

  // 3rd --> [deps], 4th --> [args]
  useDebounceWrapper(resize, 800, [screenSize], [screenSize]);

  const capture = (): Promise<void> => new Promise((resolve, reject) => {
    try {
      if (!ready) throw new Error(`Not ready: ${ready}`);

      const canvas: HTMLCanvasElement | null = canvasRef.current;
      const context: CanvasRenderingContext2D | null = canvas && canvas.getContext('2d');
      if (canvas && context) {
        // `clearRect` does not clear canvas,
        // and resizing canvas is the only way.
        // Invoking `mediaSize` to change.
        resize([screenSize]);

        // A video capture to canvas image.
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(videoRef.current as CanvasImageSource, 0, 0, canvas.width, canvas.height);

        // Canvas image to the actual image object (for face detection).
        const img = new Image();
        img.src = canvas.toDataURL();
        img.onload = async () => {
          const scale = canvas.width / img.width;
          await faceDetect(context, img, { scale });
          resolve();
        };
      }
    } catch (err) {
      reject(err);
    }
  });
  
  // Looper provides a controlled "setInterval".
  const loop = useLooper(capture, 200);

  const toggle = (): void => {
    videoControls[videoState.paused ? 'play' : 'pause']();
  };

  const makeSetter = (name: string, ref: MutableRefObject<any>): Function =>
    ({ width = 0, height = 0 }): MediaSizeType => {
      const el: any | null = ref.current;
      if (el) {
        el.width = width;
        el.height = height;
      }
      return mediaSize; // Passing it for the next in "compose".
    };

  const vSize = makeSetter('video', videoRef);
  const cSize = makeSetter('canvas', canvasRef);
  const setMediaSizeBoth = compose(vSize, cSize);

  // Resize video and canvas when "mediaSize" changes...
  useLayoutEffect(() => {
    if (!ready) return;

    setMediaSizeBoth(mediaSize);
  }, [mediaSize]);

  // Toggle buttons when "videoState.paused" changes...
  useEffect(() => {
    if (!ready) return;

    const video: any | null = videoRef.current;

    if (video.srcObject) {
      if (videoState.paused) {
        loop.destroy();
        setMessage('Paused.');
        setBtnName('Play');
        setToggleBtnClass('face-btn face-btn-play');
      } else {
        loop.start();
        setMessage('Streaming...');
        setBtnName('Pause');
        setToggleBtnClass('face-btn face-btn-pause');
      }
    } else {
      setBtnName('Play');
      setToggleBtnClass('face-btn face-btn-play');
    }
  }, [videoState.paused, ready]); // "ready" so it runs when ready.
  
  // Runs only once when mounted.
  useEffect(() => {
    resize([screenSize]); // Invoke "mediaSize" to change.

    enumerateDevices().then((list: any[] | any | unknown) => {
      list.forEach((info) => {
        const { kind, label } = info;
        print(`[kind] ${kind} [label] ${label}`);
      });
    }).then(() => (
      getUserMedia({
        video: {
          width: mediaSize.width,
          height: mediaSize.height,
        },
        audio: false,
      })
    )).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setReady(true);
        }
      }
    }).catch((err) => {
      console.warn(err);
      setMessage('Error: video stream is not supported');
      // clearMessage(8000);
    });
    
    // Stop the capture when unmounted.
    return () => {
      setReady(false);
      videoControls.pause();
      loop.destroy();
    };
  }, []);
  
  return (
    <div css={tw`flex flex-col justify-start content-center items-center`}>
      <div id="face-on" css={tw`flex flex-col justify-start content-center items-center`}>
        <div css={tw`flex flex-row justify-center content-start items-start`}>
          <button
            className={toggleBtnClass}
            onClick={() => { toggle() }}
          >{btnName}</button>
        </div>
        <div css={css`
width: ${int(mediaSize.width * 0.97)}px;
background-color: #000000;
color: #e2e2e2;
font-size: 0.9em;
padding: 0.5em;
${tw`mt-2`}
        `}>
          {message}
        </div>
        <div css={tw`mt-2`}>
          {video}
        </div>
        <div css={tw`mt-2`}>
          {canvas}
        </div>
      </div>
    </div>
  );
};
