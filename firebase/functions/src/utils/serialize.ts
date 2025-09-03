import { type SpinDoc, type SpinDto } from '../domain';

/**
 * Convert a Firestore SpinDoc (server/internal shape with Timestamps)
 * into a transport-friendly DTO (milliseconds), forming a stable API for clients.
 */
export const toDto = (d: SpinDoc): SpinDto => ({
  spinId: d.spinId,
  segmentIndex: d.segmentIndex,
  prize: d.prize,
  label: d.label,
  timestamp: d.timestamp.toMillis(),
  nextAllowedAt: d.nextAllowedAt.toMillis(),
});

/** Helper: compute remaining ms until nextAllowedAt (clamped to 0) */
export function remainingMs(nowMs: number, nextAllowedAtMs?: number) {
  if (!Number.isFinite(nextAllowedAtMs)) return 0;
  return Math.max(0, (nextAllowedAtMs as number) - nowMs);
}
