import { httpsCallable } from 'firebase/functions';

import { fns } from './firebase';

export function callFn<Req, Res>(name: string) {
  const fn = httpsCallable<Req, Res>(fns, name);
  return async (payload: Req): Promise<Res> => {
    try {
      const { data } = await fn(payload);
      return data as Res;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(msg);
    }
  };
}
