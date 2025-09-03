import React from 'react';
import { View, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Section } from '../components';

import { AUTH_MODE, useAuthStatus, type AuthMode } from '@/features/auth';
import { Text, Button } from '@/shared/ui';
import { useTheme } from '@/shared/theme';
import { auth } from '@/shared/services';
import type { RootStackParamList } from '@/app/types';

type SettingsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function SettingsScreen({ navigation }: SettingsProps) {
  const t = useTheme();
  const { ready, isAnonymous, email, uid } = useAuthStatus();

  const goAuth = (mode: AuthMode) => {
    navigation.navigate('AuthComingSoon', { mode });
  };

  return (
    <View style={[styles.container, { backgroundColor: t.colors.bg }]}>
      <Section title="Account">
        {!ready ? (
          <Text muted>Checking status...</Text>
        ) : isAnonymous ? (
          <View style={styles.col}>
            <Text muted>Login to save your spins and claim prizes.</Text>
            <View style={styles.row}>
              <Button
                title="Login"
                style={styles.button}
                onPress={() => goAuth(AUTH_MODE.LOGIN)}
              />
              <Button
                variant="secondary"
                style={styles.button}
                title="Sign Up"
                onPress={() => goAuth(AUTH_MODE.SIGNUP)}
              />
            </View>
          </View>
        ) : (
          <View style={styles.col}>
            <Text>
              <Text weight="semibold">Logged in</Text>{email ? ` as ${email}` : ''}
            </Text>
            <Text variant="caption" muted>UID: {uid}</Text>
            <View style={styles.row}>
              <Button variant="secondary" title="Log out" onPress={() => signOut(auth)} />
            </View>
          </View>
        )}
      </Section>

      <Section title="About" style={styles.aboutSection}>
        <Text>Sobeys Wheel — Test app</Text>
        <Text variant="caption" muted>Version 1.0.0 • Local build</Text>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  col: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  aboutSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
});
