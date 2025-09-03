import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '../theme';
import type { ButtonProps } from './types';
import Text from './Text';

export default function Button({
  title,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
  fullWidth = true,
}: ButtonProps) {
  const t = useTheme();
  const isPrimary = variant === 'primary';

  const palette = disabled
    ? {
      bg: t.colors.disabledBg,
      border: t.colors.disabledBorder,
      label: t.colors.disabledText,
    }
    : isPrimary
      ? {
        bg: t.colors.brand,
        border: 'transparent',
        label: t.colors.onBrand,
      }
      : {
        bg: t.colors.surface,
        border: t.colors.border,
        label: t.colors.text,
      };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => StyleSheet.flatten(
        [
          styles.base,
          {
            borderRadius: t.radius.pill,
            backgroundColor: palette.bg,
            borderWidth: isPrimary ? 0 : 1,
            borderColor: palette.border,
            opacity: disabled ? 1 : pressed ? 0.92 : 1,
            alignSelf: fullWidth ? 'stretch' : 'center',
          },
          style,
        ]
      )}
    >
      <Text variant="body" weight="regular" color={palette.label}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 160,
    backgroundColor: 'red',
    height: 40,
  },
});
