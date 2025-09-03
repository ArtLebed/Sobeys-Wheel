import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getHistory, subscribeHistory } from '../api';
import type { HistoryResp } from '../types';

// One-off fetch (used for initial state / pull-to-refresh).
async function fetchHistoryOnce(): Promise<HistoryResp[]> {
  return await getHistory({});
}

export function useHistory(uid: string) {
  const qc = useQueryClient();

  const key = useMemo(() => ['history', uid], [uid]);

  const query = useQuery({
    queryKey: key,
    enabled: !!uid,
    queryFn: fetchHistoryOnce,
    staleTime: Infinity,
  });

  // Live updates layered over the cache
  useEffect(() => {
    if (!uid) return;
    return subscribeHistory(uid, rows => {
      qc.setQueryData<HistoryResp[]>(key, rows);
    });
  }, [qc, uid]);

  return query;
}
