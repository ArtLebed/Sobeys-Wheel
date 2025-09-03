import React from 'react';
import { Text as RNText, type TextStyle } from 'react-native';

import { type ThemeTypes, useTheme } from '../theme';
import type { Variant, Weight, TextProps } from './types';

const TYPO: Record<Variant, TextStyle> = {
  h1: { fontSize: 24, lineHeight: 28 },
  title: { fontSize: 18, lineHeight: 22 },
  body: { fontSize: 16, lineHeight: 22 },
  caption: { fontSize: 12, lineHeight: 16 },
};

const WEIGHT: Record<Weight, TextStyle> = {
  regular: { fontWeight: '400' },
  semibold: { fontWeight: '600' },
};

// Narrow a string to a theme color key at runtime for safe indexing.
function isThemeColorName(k: string, colors: ThemeTypes['colors']): k is keyof ThemeTypes['colors'] {
  return k in colors;
}

export default function Text({
  variant = 'body',
  weight = 'regular',
  color,
  muted,
  style,
  children,
}: TextProps) {
  const t = useTheme();

  // If `color` is provided:
  // - if it's a theme key -> resolve from theme
  // - otherwise treat it as raw color string
  // If `color` is not provided:
  // - use muted or regular text color from theme
  const resolvedColor =
    color != null
      ? (isThemeColorName(color, t.colors)
        ? t.colors[color]
        : String(color))
      : (muted ? t.colors.textMuted : t.colors.text);

  return (
    <RNText style={[TYPO[variant], WEIGHT[weight], { color: resolvedColor }, style]}>
      {children}
    </RNText>
  );
}
