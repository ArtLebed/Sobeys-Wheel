import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { getCooldown } from '../api/getCooldown';
import { SECOND } from '../constants';

export function useCooldown(uid?: string, tickMs = SECOND) {
  const [remaining, setRemaining] = useState(0);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const leftMsRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const startCountdown = useCallback((remainingMs: number) => {
    clearTimer();
    leftMsRef.current = Math.max(0, Math.floor(remainingMs));

    const tick = () => {
      leftMsRef.current = Math.max(0, leftMsRef.current - tickMs);
      setRemaining(Math.ceil(leftMsRef.current / 1000));
      if (leftMsRef.current <= 0) {
        clearTimer();
      }
    };

    setRemaining(Math.ceil(leftMsRef.current / 1000));
    timer.current = setInterval(tick, tickMs);
  }, [clearTimer, tickMs]);

  useEffect(() => {
    let cancelled = false;
    async function prime() {
      if (!uid) {
        clearTimer();
        setRemaining(0);
        return;
      }
      try {
        const data = await getCooldown();
        if (!cancelled) {
          startCountdown(data.remainingMs ?? 0);
        }
      } catch (e) {}
    }
    void prime();
    return () => {
      cancelled = true;
    };
  }, [uid, startCountdown, clearTimer]);

  const setFromServer = useMemo(
    () => (remainingMs: number) => {
      if (Number.isFinite(remainingMs)) {
        startCountdown(remainingMs);
      }
    },
    [startCountdown]
  );

  useEffect(() => clearTimer, [clearTimer]);

  return { remaining, setFromServer };
}
