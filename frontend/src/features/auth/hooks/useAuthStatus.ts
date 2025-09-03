import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/shared/services';

export function useAuthStatus() {
  const [ready, setReady] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, u => {
      setReady(true);
      setIsAnonymous(!u || u.isAnonymous);
      setEmail(u?.email ?? null);
      setUid(u?.uid ?? null);
    })
  }, []);

  return { ready, isAnonymous, email, uid };
}
