/**
 */
import { useRef, useState } from 'react';

// const print = (s = '') => console.log(`[useLooper] ${s}`);

export const useLooper = () => {
  const [timer, setTimer] = useState<any | null>(null);
  const [inProgress, setInProgress] = useState<boolean>(false);
  
  const startSaved: { current: any } = useRef();
  const destroySaved: { current: any } = useRef();
  
  const start = (f, msec) => {
    startSaved.current = f;
    const id = setInterval(() => {
      if (inProgress) return;
      (async () => {
        setInProgress(true);
        await startSaved.current();
        setInProgress(false);
      })();
    }, msec);
    setTimer(id);
  };
  
  const destroy = (g) => {
    destroySaved.current = g;
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (g) {
      g();
    }
  };
  
  return {
    start,
    destroy,
  };
}
