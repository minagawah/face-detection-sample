/**
 * Face Detection API
 */
/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback, RefObject } from 'react';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import tw from 'tailwind.macro';
import { useVideo, useDebounce } from 'react-use';
import { faceDetect } from './lib/facedetector';
import { useScreenSize } from './contexts/ScreenSize';
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

export const Face: React.FC = (props) => {
  const screensize: any = useScreenSize();

  const [video, videoState, videoControls, videoRef] = useVideo(
    <video id="face-video" autoPlay />
  );
  
  const [canvas, canvasState, canvasRef] = useCanvas(
    <canvas id="face-canvas" />
  );
  
  const [mediaSize, setMediaSize] = useState({ width: 0, height: 0 });
  const [btnName, setBtnName] = useState('Play');
  const [toggleBtnClass, setToggleBtnClass] = useState('face-btn');
  const [message, setMessage] = useState('');
  
  const clearMessage = (msec = 1000) => {
    setTimeout(() => { setMessage(''); }, msec);
  };
  
  const toggle: Function = (): void => {
    if (videoState.paused) {
      videoControls.play();
    } else {
      videoControls.pause();
    }
  }

  const resize = useCallback(() => {
    const screen_w = screensize.size.width;
    const screen_h = screensize.size.height;
    const avail = screen_h * 0.7;
    const height = int(avail / 2);
    const width = int(height * RATIO);
    
    setMediaSize({ width, height });
    // console.log('screensize.size', screensize.size);
    // print(`mediaSize: ${width}x${height}`);
    
    const video: any | null = videoRef.current;
    const canvas: any | null = canvasRef.current;
    if (video) {
      video.width = width;
      video.height = height;
    }
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }, []);
  
  const capture: Function = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // print('++++ capture()');
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        const context: CanvasRenderingContext2D | null = canvas && canvas.getContext('2d');
        if (canvas && context) {
          // Resizing canvas is the only way to clearRect...
          resize();

          // Video to canvas.
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.drawImage(videoRef.current as CanvasImageSource, 0, 0, canvas.width, canvas.height);

          // Canvas to `img` object (for Face Detection).
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
  };

  useDebounce(resize, 800, [screensize.size]);
  
  useEffect(() => {
    resize();

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
  
  return (
    <div css={css`
${tw`flex flex-col justify-start content-center items-center`}
    `}>
      <div id="face-on" css={css`
${tw`flex flex-col justify-start content-center items-center`}
      `}>
        <div className="face-row" css={css`
${tw`flex flex-row justify-center content-start items-start`}
        `}>
          <button
            className={toggleBtnClass}
            onClick={() => { toggle() }}
          >{btnName}</button>
        </div>
        <div className="face-row face-message" css={css`width: ${int(mediaSize.width * 0.97)}px;`}>
          {message}
        </div>
        <div className="face-row">
          {video}
        </div>
        <div className="face-row">
          {canvas}
        </div>
      </div>
    </div>
  );
};
