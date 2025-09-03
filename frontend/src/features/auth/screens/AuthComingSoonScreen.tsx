import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AUTH_MODE, type AuthMode } from '@/features/auth';
import { Text, Button } from '@/shared/ui';
import { RootStackParamList } from "@/app/types";

type AuthComingSoonProps = NativeStackScreenProps<RootStackParamList, 'AuthComingSoon'>;

export default function AuthComingSoonScreen({ route, navigation }: AuthComingSoonProps) {
  const mode: AuthMode = route.params?.mode ?? AUTH_MODE.LOGIN;

  return (
      <View style={styles.container}>
        <Text variant="h1" weight="semibold">Auth placeholder</Text>
        <Text muted style={styles.text}>
          {`Here you'd see the Sobeys ${mode} page opened in webview.`}
        </Text>
        <Button title="Close" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding:16,
  },
  text: {
    marginTop: 8,
    marginBottom: 24,
  },
});
