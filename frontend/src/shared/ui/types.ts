import React from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

import type { ThemeTypes } from '../theme';

export type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  fullWidth?: boolean;
};

export type Variant = 'h1' | 'title' | 'body' | 'caption';
export type Weight  = 'regular' | 'semibold';
export type ColorToken = keyof ThemeTypes['colors'] | string;

export type TextProps = {
  children?: React.ReactNode;
  variant?: Variant;
  weight?: Weight;
  color?: ColorToken;
  muted?: boolean;
  style?: TextStyle | TextStyle[];
}
