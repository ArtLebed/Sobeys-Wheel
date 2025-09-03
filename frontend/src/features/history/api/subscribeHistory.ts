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
    const rows: HistoryResp[] = snap.docs.map((d) => {
      const x = d.data();
      return {
        spinId: x.spinId,
        segmentIndex: x.segmentIndex,
        prize: x.prize,
        label: x.label,
        timestamp: x.timestamp.toMillis(),
      };
    });
    cb(rows);
  });
}
