import React, { useEffect, useRef } from 'react';
import { Modal, View, Pressable, Animated, StyleSheet } from 'react-native';

import { prizeToCopy } from '../lib/prize';
import type { ResultModalProps } from './types';
import { TITLE_MODAL_LOSE } from '../constants';

import { useTheme } from '@/shared/theme';
import { Text, Button } from '@/shared/ui';

export default function ResultModal({ visible, result, onClose, onSignIn, onSignUp }: ResultModalProps) {
  const t = useTheme();
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    } else {
      opacity.setValue(0);
      scale.setValue(0.9);
    }
  }, [visible, opacity, scale]);

  if (!result) return null;

  const kind = result.prize.type;
  const won = kind !== "none";
  const copy = prizeToCopy(result.prize);

  const sheetRing = won ? t.colors.accent : t.colors.border;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: t.colors.bg,
              borderColor: sheetRing,
              transform: [{ scale }],
              opacity,
            },
            t.shadow.card,
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.content}>
            <View style={styles.texts}>
              <Text variant="h1" weight="semibold">{copy.title}</Text>
              <Text variant="body" muted>{copy.subtitle}</Text>
            </View>

            {won ? (
              <View style={styles.row}>
                <Button
                  title="Login"
                  onPress={onSignIn ?? onClose}
                  fullWidth={false}
                />
                <Button
                  title="Sign Up"
                  onPress={onSignUp ?? onClose}
                  fullWidth={false}
                  variant="secondary"
                />
              </View>
            ) : (
              <Button title={TITLE_MODAL_LOSE} onPress={onClose} />
            )}
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sheet: {
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  texts: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
});
