/**
 * Copied and modified the original from `react-use`.
 * Issue:
 * https://github.com/streamich/react-use/issues/618
 */
import { useUpdateEffect } from 'react-use';

export const useDebounce = (fn: (...args: any[]) => any, ms: number = 0, args: any[] = []) => {
  useUpdateEffect(() => {
    const handle = setTimeout(fn.bind(null, args), ms);

    return () => {
      // if args change then clear timeout
      clearTimeout(handle);
    };
  }, args);
}
