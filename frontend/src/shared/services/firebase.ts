import 'react-native-get-random-values';
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

import { ENV } from '../config/env';

// helper to resolve host
function resolveEmulatorHost() {
  // If running on a real Android device over Wi-Fi — use the Metro host IP
  const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
  const devHost = scriptURL ? scriptURL.split('://')[1].split(':')[0] : undefined;

  if (Platform.OS === 'android') {
    // Emulator → 10.0.2.2; real device → host machine IP (if it’s not localhost)
    if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') return devHost;
    return '10.0.2.2';
  }
  return 'localhost';
}

const EMULATOR_HOST = resolveEmulatorHost();

const app = initializeApp({
  apiKey: 'AIzaSyD-FAKE-KEY-FOR-LOCAL-DEV-123456',
  authDomain: 'demo.firebaseapp.com',
  projectId: ENV.PROJECT_ID,
  appId: '1:demo:web:demo',
});

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const fns = getFunctions(app, ENV.REGION);

if (ENV.USE_EMULATORS) {
  connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${ENV.AUTH_EMULATOR_PORT}`);
  connectFirestoreEmulator(db, EMULATOR_HOST, ENV.FS_EMULATOR_PORT);
  connectFunctionsEmulator(fns, EMULATOR_HOST, ENV.FNS_EMULATOR_PORT);
}
