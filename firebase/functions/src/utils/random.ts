import { randomInt } from 'crypto';

/** Cryptographically secure weighted index selection. We scale weights to integers for randomInt. */
export function pickWeightedIndex(weights: number[]): number {
  if (!Array.isArray(weights) || weights.length === 0) {
    throw new Error('weights empty');
  }
  // Scale weights to integers to avoid floating-point bias; 1e6 is a practical scale.
  const scale = 1e6;
  const scaled = weights.map((w) => Math.max(1, Math.round(w * scale)));
  const total = scaled.reduce((a, b) => a + b, 0);
  let r = randomInt(0, total); // [0, total)
  for (let i = 0; i < scaled.length; i++) {
    if (r < scaled[i]) {
      return i;
    }
    r -= scaled[i];
  }
  return scaled.length - 1;
}
