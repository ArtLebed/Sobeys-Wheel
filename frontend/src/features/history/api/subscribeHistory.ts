import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

import type { HistoryResp } from '../types';

import { db } from '@/shared/services';

export function subscribeHistory(uid: string, cb: (rows: HistoryResp[]) => void) {
  const q = query(
    collection(db, 'users', uid, 'spins'),
    orderBy('timestamp', 'desc'),
    limit(50),
  );

  return onSnapshot(q, snap => {
    const rows = snap.docs.map(d => d.data() as HistoryResp);
    cb(rows);
  });
}
