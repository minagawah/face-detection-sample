/**
 */
import { useEffect, useRef, useState } from 'react';

// const print = (s = '') => console.log(`[useLooper] ${s}`);

export const useLooper = (f: Function, ms: number | null) => {
  const [msec, setMsec] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);
  const fSaved = useRef<Function>(() => {});

  const start = () => {
    setMsec(ms);
  };
  
  const destroy = () => {
    setMsec(null);
  };
  
  useEffect(() => {
    fSaved.current = f;
  });

  useEffect(() => {
    let cleanup;
    if (msec !== null) {
      let timerId: any | null = setInterval(async () => {
        if (!inProgress) {
          setInProgress(true);
          await fSaved.current();
          setInProgress(false);
        }
      }, msec);
      cleanup = () => {
        clearInterval(timerId);
        timerId = null;
      };
    }
    return cleanup;
  }, [msec, inProgress]);
  
  return {
    start,
    destroy,
  };
}
