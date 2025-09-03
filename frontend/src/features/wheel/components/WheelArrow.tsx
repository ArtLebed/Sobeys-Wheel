import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { SIZE } from '../constants';

import { useTheme } from '@/shared/theme';

export default function WheelArrow() {
  const t = useTheme();

  return (
    <Svg width={SIZE} height={SIZE} style={styles.arrow} pointerEvents="none">
      <Polygon
        points={`12,${SIZE / 2 - 14} 12, ${SIZE / 2 + 14} 36, ${SIZE / 2}`}
        fill={t.wheel.pointer}
        stroke={t.colors.text}
        strokeWidth={1}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  arrow: {
    position: 'absolute',
    top: 0,
    left: -42,
  }
});
