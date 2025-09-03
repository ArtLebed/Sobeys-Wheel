const SEG_ANGLE = 45;
const START_DEG = -90;
const CENTER_OFFSET = START_DEG + SEG_ANGLE / 2;
const POINTER_DEG = 180;

const norm360 = (x: number) => ((x % 360) + 360) % 360;

export function targetRotationDeg(segmentIndex: number, baseTurns = 5) {
  const centerDeg = segmentIndex * SEG_ANGLE + CENTER_OFFSET;
  const delta = norm360(POINTER_DEG - centerDeg);
  return baseTurns * 360 + delta;
}

export function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

export function deg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polarToCartesian(cx, cy, r, a0);
  const p1 = polarToCartesian(cx, cy, r, a1);
  const largeArcFlag = a1 - a0 <= Math.PI ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${p0.x} ${p0.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${p1.x} ${p1.y}`,
    'Z',
  ].join(' ');
}
