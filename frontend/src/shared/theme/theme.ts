import { Platform, ViewStyle } from 'react-native';

import type { ThemeTypes } from './types';

const twShadow: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  android: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
})!;

export const Theme: ThemeTypes = {
  colors: {
    brand: '#013d2a',
    onBrand: '#FFFFFF',
    accent: '#8cb94d',
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#000000',
    textMuted: '#64748B',

    border: '#DCDCDC',
    disabledBg: '#E9EDF0',
    disabledBorder: '#D6DDE1',
    disabledText: '#6B7280',
    error: '#E53935',
  },
  radius: { sm: 8, md: 12, lg: 20, pill: 999 },
  shadow: { card: twShadow },
  border: {
    thin: { borderWidth: 1, borderColor: '#DCDCDC' },
  },

  wheel: {
    ring: '#E5E7EB',
    hub: '#FFFFFF',
    pointer: '#E53935',
    palette: ['#013d2a', '#1f6f54', '#8cb94d', '#ffd166', '#fca311', '#ef476f', '#457b9d', '#6c757d'],
  },
};
