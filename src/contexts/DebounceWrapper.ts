import { useDebounce } from 'react-use';

export const useDebounceWrapper = (
  fn: (...args: any[]) => any, ms: number = 0, deps: any[] = [], args: any[] = []
) => {
  useDebounce(fn.bind(null, ...args), ms, deps);
}
