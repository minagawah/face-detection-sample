/**
 * Face Detection API
 */
import React, { useEffect } from 'react';
import { useScreenSize } from '../contexts/ScreenSize';

const int = Math.trunc;

const RATIO = 16 / 9;
const MARGIN = 15;
const PLAYER_WIDTH = 320;
const PLAYER_HEIGHT = int(PLAYER_WIDTH / RATIO);
const CANVAS_WIDTH = PLAYER_WIDTH;
const CANVAS_HEIGHT = PLAYER_HEIGHT;

const WRAPPER_WIDTH = PLAYER_WIDTH;
const WRAPPER_HEIGHT = PLAYER_HEIGHT + CANVAS_HEIGHT + 220;
const WRAPPER_MARGIN = 10;

export const Face: React.FC = () => {
  const ss: any = useScreenSize();

  useEffect(() => {
    console.log(ss.size);
  }, [ss.size]);

  let context;
  let cameraStream;

  return (
    <div className="face-wrapper">
      <h2>Face</h2>
      <p className="example">
        Face Detection API Example
      </p>
      <div className="face-message">
        {ss.size.width}x{ss.size.height}
      </div>
      <div>
        <div id="face-on" className="cols justify-start align-center">
          <div className="face-row">
            <video
              id="face-player"
              controls
              autoPlay
              width={PLAYER_WIDTH}
              height={PLAYER_HEIGHT}
            ></video>
          </div>
          <div className="face-row">
            <canvas
              id="face-canvas"
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            ></canvas>
          </div>
          <div className="face-row rows justify-center align-top">
            <button id="face-btn-start" className="face-btn">Start</button>
            <button id="face-btn-stop" className="face-btn">Stop</button>
          </div>
          <div className="face-row">
            <button id="face-btn-capture" className="face-btn">Capture</button>
          </div>
        </div>
      </div>
    </div>
  );
};
