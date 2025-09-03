import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

import { WheelArrow, WheelFace, ResultModal } from '../components';
import { useWheelConfig, useCooldown, useSpin } from '../hooks';
import { targetRotationDeg } from '../lib/angles';
import { SIZE } from '../constants';
import { SpinSuccess, WheelProps } from '../types';

import { AUTH_MODE, type AuthMode } from '@/features/auth';
import { auth } from '@/shared/services';
import { useTheme } from '@/shared/theme';
import { Button } from '@/shared/ui';

export default function WheelScreen({ navigation }: WheelProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<SpinSuccess | null>(null);
  const { data: cfg, loading, error } = useWheelConfig();
  const { remaining, setFromServer } = useCooldown(auth.currentUser?.uid);
  const t = useTheme();
  const rot = useRef(new Animated.Value(0)).current;

  const { onSpin, isSpinning, spinError } = useSpin({
    setCooldownFromServer: setFromServer,
    onResult: (res) => {
      const { segmentIndex } = res;
      rot.setValue(0);
      Animated.timing(rot, {
        toValue: targetRotationDeg(segmentIndex, 5),
        duration: 2800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setLastResult(res);
        setModalVisible(true);
      });
    },
  });

  const handleGoAuth = (mode: AuthMode) => {
    setModalVisible(false);
    navigation.navigate('AuthComingSoon', { mode });
  };

  const rotate = rot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      {(error || spinError) && <Text style={{ color: t.colors.error }}>{error?.message}</Text>}
      {loading || !cfg ? (
        <Text style={styles.center}>Loading wheel...</Text>
      ) : (
        <View style={styles.wheelContainer}>
          <Animated.View style={[
            StyleSheet.absoluteFillObject,
            { transform: [{ rotate }], },
            t.shadow.card,
            { backgroundColor: t.colors.surface, borderRadius: SIZE / 2 },
          ]}>
            <WheelFace size={SIZE} segments={cfg.segments} />
          </Animated.View>
          <WheelArrow />
        </View>
      )}
      <Button
        title={remaining > 0 ? `Next spin in ${remaining}s` : 'Spin'}
        onPress={onSpin}
        disabled={remaining > 0 || isSpinning}
      />
      <ResultModal
        visible={modalVisible}
        result={lastResult}
        onClose={() => setModalVisible(false)}
        onSignIn={() => handleGoAuth(AUTH_MODE.LOGIN)}
        onSignUp={() => handleGoAuth(AUTH_MODE.SIGNUP)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    flex: 1,
    justifyContent:'center',
  },
  wheelContainer: {
    width: SIZE,
    height: SIZE,
    alignSelf: 'center',
    position: 'relative',
  },
  center: {
    textAlign: 'center',
  },
});
