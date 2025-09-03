import 'react-native-get-random-values';
import { useCallback, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { spinWheel } from '../api/spinWheel';
import { toUserMessage } from '../lib/toUserMesage';
import type { SpinResponse, UseSpinProps } from '../types';

export function useSpin({ onResult, setCooldownFromServer }: UseSpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinError, setSpinError] = useState<string | null>(null);

  // Keep the same request id across retries to ensure idempotency.
  const reqIdRef = useRef<string | undefined>(undefined);

  const lockRef = useRef(false);

  const onSpin = useCallback(async () => {
    if (isSpinning) return; // prevent double taps while in-flight
    setIsSpinning(true);
    setSpinError(null);

    // Generate (or reuse) a request id for this attempt
    reqIdRef.current = reqIdRef.current ?? uuidv4() as string;

    try {
      const res: SpinResponse = await spinWheel({ clientRequestId: reqIdRef.current });

      if (res.status === 'COOLDOWN') {
        // Update cooldown timer from server-authoritative time
        setSpinError('It`s too soon to spin again. Please wait for the cooldown.');
        setCooldownFromServer(res.remainingMs);
        return res;
      }

      // Success: trigger animation & update cooldown for next time
      setCooldownFromServer(res.remainingMs);
      onResult?.(res);

      // Allow a new id for the next user tap
      reqIdRef.current = undefined;

      return res;
    } catch (e) {
      const msg = toUserMessage(e);
      setSpinError(msg);
    } finally {
      setIsSpinning(false);
      lockRef.current = false;
    }
  }, [isSpinning, onResult, setCooldownFromServer]);

  return { onSpin, isSpinning, spinError };
}
