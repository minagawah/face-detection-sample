/**
 * Face Detection API
 */
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, RefObject, MutableRefObject } from 'react';
import { compose, apply } from 'ramda';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import tw from 'tailwind.macro';
import { useVideo } from 'react-use';
// @todo
// https://github.com/streamich/react-use/issues/618
// -----------------------------------------------------------
// import { useVideo, useDebounce } from 'react-use';
import { useDebounce } from './contexts/Debounce';
// -----------------------------------------------------------
import { faceDetect } from './lib/facedetector';
import { useScreenSize, getScreenSize, ScreenSizeStateType } from './contexts/ScreenSize';
import { useCanvas } from './contexts/Canvas';
import { useLooper } from './contexts/Looper';

import './Face.css';

const int = Math.trunc;
const print: Function = (s: string): void => console.log(`[Face] ${s}`);

const RATIO = 16 / 9;

const enumerateDevices = (): Promise<any[] | any | unknown> => {
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices().then((list) => {
      resolve(list);
    }).catch((err) => {
      console.error('Failed: navigator.mediaDevices.enumerateDevices');
      reject(err);
    });
    // if (!('mediaDevices' in navigator)) {
    //   reject(new Error('No support for media handling (navigator.mediaDevices)'));
    // } else if (typeof navigator.mediaDevices.enumerateDevices !== 'function') {
    //   reject(new Error('No support for video streaming (navigator.mediaDevices.enumerateDevices)'));
    // } else {
    //   navigator.mediaDevices.enumerateDevices().then((list) => {
    //     resolve(list);
    //   }).catch((err) => {
    //     console.error('Failed: navigator.mediaDevices.enumerateDevices');
    //     reject(err);
    //   });
    // }
  });
};

const getUserMedia = (options = {}): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!('mediaDevices' in navigator)) {
      reject(new Error('No support for media handling (navigator.mediaDevices)'));
    } else if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
      reject(new Error('No support for video streaming (navigator.mediaDevices.getUserMedia)'));
    } else {
      navigator.mediaDevices.getUserMedia(options).then((stream) => {
        resolve(stream);
      }).catch((err) => {
        console.error('Failed: navigator.mediaDevices.getUserMedia');
        reject(err);
      });
    }
  });
};

const calculateMediaSize = (screenSize: ScreenSizeStateType) => {
  const { width: screen_w = 0, height: screen_h = 0 } = screenSize || {};
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

  const [mediaSize, setMediaSize] = useState(calculateMediaSize(screenSize));
  const [btnName, setBtnName] = useState('Play');
  const [toggleBtnClass, setToggleBtnClass] = useState('face-btn');
  const [message, setMessage] = useState('');
  
  // apply: <L extends any[]>(fn: Function) => (args: L) => fn(...args: L)
  const resize = apply(compose(setMediaSize, calculateMediaSize));

  useDebounce(resize, 800, [screenSize]);

  const toggle = useCallback((): void => {
    videoControls[videoState.paused ? 'play' : 'pause']();
  }, [videoState]);

  const capture = (): Promise<void> => new Promise((resolve, reject) => {
    try {
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      const context: CanvasRenderingContext2D | null = canvas && canvas.getContext('2d');
      if (canvas && context) {
        // Since "clearRect" does not clear canvas,
        // resizing canvas size is the only way.
        // Invoke "mediaSize" to change.
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

  // Partial application function.
  const makeSetter = (ref: MutableRefObject<any>): Function =>
    ({ width = 0, height = 0 }): MediaSizeType => {
      const el: any | null = ref.current;
      if (el) {
        el.width = width;
        el.height = height;
      }
      return mediaSize;
    };

  const vSize = makeSetter(videoRef);
  const cSize = makeSetter(canvasRef);

  useEffect(() => {
    compose(vSize, cSize)(mediaSize);
  }, [mediaSize]);

  useEffect(() => {
    resize([screenSize]); // Invoke "mediaSize" to change.

    try {
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
        }
      }).catch((err) => {
        console.error('Failed: navigator.mediaDevices');
        console.warn(err);
        setMessage('Error: video stream is not supported');
        // clearMessage(8000);
      });
    } catch (err) {
      console.error('Failed: video stream');
      console.warn(err);
    }
  }, []);
  
  const loop = useLooper();

  useEffect(() => {
    const video: any | null = videoRef.current;
    if (video.srcObject) {
      if (videoState.paused) {
        loop.destroy(() => {});
        setMessage('Paused.');
        setBtnName('Play');
        setToggleBtnClass('face-btn face-btn-play');
      } else {
        loop.start(async () => { await capture(); }, 200);
        setMessage('Streaming...');
        setBtnName('Pause');
        setToggleBtnClass('face-btn face-btn-pause');
      }
    } else {
      setBtnName('Play');
      setToggleBtnClass('face-btn face-btn-play');
    }
  }, [videoState.paused]);

  // <button
  //   className="face-btn face-btn-capture"
  //   style={{ marginLeft: '0.4em' }}
  //   onClick={() => { capture() }}
  // >Capture</button>

  const Row = styled.div`${tw`mt-2`}`;
  
  return (
    <div css={tw`flex flex-col justify-start content-center items-center`}>
      <div id="face-on" css={tw`flex flex-col justify-start content-center items-center`}>
        <Row css={tw`flex flex-row justify-center content-start items-start`}>
          <button
            className={toggleBtnClass}
            onClick={() => { toggle() }}
          >{btnName}</button>
        </Row>
        <Row css={css`
width: ${int(mediaSize.width * 0.97)}px;
background-color: #000000;
color: #e2e2e2;
font-size: 0.9em;
padding: 0.5em;
        `}>
          {message}
        </Row>
        <Row>
          {video}
        </Row>
        <Row>
          {canvas}
        </Row>
      </div>
    </div>
  );
};
