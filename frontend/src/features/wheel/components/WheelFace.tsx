import React from 'react';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';

import { SIZE, TAU } from '../constants';
import { arcPath, deg, polarToCartesian } from '../lib/angles';
import type { WheelFaceProps } from './types';

import { useTheme } from '@/shared/theme';

export default function WheelFace({ size = SIZE, segments }: WheelFaceProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = (size / 2) - 4;
  const n = segments.length || 8;
  const step = TAU / n;
  const t = useTheme();

  return (
    <Svg width={size} height={size}>
      <G>
        {segments.map((s, i) => {
          const a0 = -Math.PI / 2 + i * step;
          const a1 = a0 + step;
          const path = arcPath(cx, cy, r, a0, a1);
          const mid = a0 + step / 2;
          const startR = r * 0.86;
          const start = polarToCartesian(cx, cy, startR, mid);
          const angle = deg(mid) + 180;
          const fill = s.color ?? t.wheel.palette[i % t.wheel.palette.length];

          return (
            <G key={i}>
              <Path d={path} fill={fill} />
              <SvgText
                x={start.x}
                y={start.y}
                fontSize={Math.max(11, Math.floor(size * 0.04))}
                fontWeight="600"
                fill={s.textColor || t.colors.text}
                textAnchor="start"
                alignmentBaseline="middle"
                transform={`rotate(${angle} ${start.x} ${start.y})`}
              >
                {s.label}
              </SvgText>
            </G>
          );
        })}
        <Circle cx={cx} cy={cy} r={28} fill="#fff" stroke={t.wheel.ring} />
      </G>
    </Svg>
  );
}
