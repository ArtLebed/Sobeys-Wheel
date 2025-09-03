import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

import { AppProviders } from '@/app/AppProviders';
import RootNav from '@/app/navigation';
import { auth } from '@/shared/services/firebase';
import { Button } from '@/shared/ui';

export default function App() {
  const [ready, setReady] = useState(false);
  const [authErr, setAuthErr] = useState<Error | null>(null);
  const signingRef = useRef(false); // guard

  const tryAnon = useCallback(async () => {
    if (signingRef.current) {
      return;
    }
    signingRef.current = true;
    setAuthErr(null);
    try {
      await signInAnonymously(auth);
      // onAuthStateChanged will set ready=true on success
    } catch (e: any) {
      setAuthErr(e instanceof Error ? e : new Error(String(e)));
      setReady(true); // leave the spinner; show error + retry button
    } finally {
      signingRef.current = false;
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(
      auth,
      (u) => {
        if (!u) {
          void tryAnon();
          return;
        }
        setReady(true);
      },
      (err) => {
        setAuthErr(err as Error);
        setReady(true);
      }
    );
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProviders>
        <StatusBar barStyle="light-content" />
        {!ready ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.mtop8}>Starting…</Text>
          </View>
        ) : authErr ? (
          <View style={styles.center}>
            <Text style={styles.err}>Auth error: {authErr.message}</Text>
            <Button title="Try again" onPress={tryAnon} />
          </View>
        ) : (
          <RootNav />
        )}
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  err: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  mtop8: {
    marginTop: 8,
  },
});
