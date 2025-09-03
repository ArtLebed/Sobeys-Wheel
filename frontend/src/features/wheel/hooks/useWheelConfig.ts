import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

import type { WheelConfig } from '../types';

import { db } from '@/shared/services';
import { ENV } from '@/shared/config/env';

export function useWheelConfig(docPath = ENV.WHEEL_CONFIG_PATH) {
  const [data, setData] = useState<WheelConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    return onSnapshot(
      doc(db, docPath),
      (snap) => {
        setData(snap.data() as WheelConfig);
        setLoading(false);
      },
      (e) => {
        setError(e);
        setLoading(false);
      }
    );
  }, [docPath]);

  return { data, loading, error };
}
