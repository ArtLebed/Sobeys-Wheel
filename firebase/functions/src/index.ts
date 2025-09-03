import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

import { paths, type WheelConfigDoc, type SpinDoc, type SpinResponse } from './domain';
import {
  pickWeightedIndex,
  toDto,
  isPositiveFiniteNumber,
  parseSpinReq,
  requireAuth,
  validateClientRequestId,
  remainingMs
} from './utils';

setGlobalOptions({ maxInstances: 10, region: "us-central1" });
initializeApp();

const db = getFirestore();

/**
 * spinWheel — server-authoritative:
 * - idempotency via clientRequestId (spinId = clientRequestId)
 * - cooldown enforcement
 * - weighted segment selection (crypto RNG)
 * - stable DTO (milliseconds)
 */
export const spinWheel = onCall(async (req): Promise<SpinResponse> => {
  // Parse & validate request payload
  const uid = requireAuth(req);
  const { clientRequestId } = parseSpinReq(req.data);
  const requestId = validateClientRequestId(clientRequestId)

  const cfgRef = db.doc(paths.wheelConfigDoc);
  const userSpins = db.collection(paths.userSpins(uid));
  const spinRef = userSpins.doc(requestId);
  const now = Timestamp.now();
  const nowMs = now.toMillis();

  return await db.runTransaction<SpinResponse>(async (tx) => {
    // Read the config inside the transaction so it participates in the read set
    const cfgSnap = await tx.get(cfgRef);
    if (!cfgSnap.exists) {
      throw new HttpsError("failed-precondition", "wheelConfig missing");
    }
    const cfg = cfgSnap.data() as WheelConfigDoc;
    if (!cfg?.segments || cfg.segments.length !== 8) {
      throw new HttpsError("failed-precondition", "wheelConfig invalid (must be 8 segments)");
    }
    if (cfg.segments.some((s) => !Number.isFinite(s.weight) || s.weight <= 0)) {
      throw new HttpsError("failed-precondition", "segment weights must be > 0");
    }

    // Idempotency: if a spin with this ID already exists — return the previous result
    const existing = await tx.get(spinRef);
    if (existing.exists) {
      const dto = toDto(existing.data() as SpinDoc);
      const rem = remainingMs(nowMs, dto.nextAllowedAt);
      return { status: "OK", ...dto, remainingMs: rem }
    }

    // Fetch the latest spin to enforce cooldown
    const lastSnap = await tx.get(userSpins.orderBy("timestamp", "desc").limit(1));
    if (!lastSnap.empty) {
      const last = lastSnap.docs[0].data() as SpinDoc;
      const nextAllowedAtMs = last.nextAllowedAt.toMillis();
      if (nowMs < nextAllowedAtMs) {
        const rem = remainingMs(nowMs, nextAllowedAtMs);
        return { status: "COOLDOWN", nextAllowedAt: nextAllowedAtMs, remainingMs: rem } as SpinResponse;
      }
    }

    // Weighted segment selection — crypto RNG
    const idx = pickWeightedIndex(cfg.segments.map((s) => s.weight));
    const seg = cfg.segments[idx];

    const cooldownMs = isPositiveFiniteNumber(cfg.cooldownMs) ? cfg.cooldownMs : 60_000;
    const nextAllowedAt = Timestamp.fromMillis(now.toMillis() + cooldownMs);

    const doc: SpinDoc = {
      spinId: requestId,
      uid,
      segmentIndex: idx,
      prize: seg.prize,
      label: seg.label,
      timestamp: now,
      nextAllowedAt,
    };

    tx.create(spinRef, doc);
    const dto = toDto(doc);
    const rem = remainingMs(nowMs, dto.nextAllowedAt);
    return { status: "OK", ...dto, remainingMs: rem };
  });
});

/**
 * getHistory — returns the user's latest spins (up to 50) in DTO format
 */
export const getHistory = onCall({ cors: true }, async (req) => {
  const uid = requireAuth(req);

  const snaps = await db
    .collection(paths.userSpins(uid))
    .orderBy("timestamp", "desc")
    .limit(50)
    .get();

  return snaps.docs.map((d) => toDto(d.data() as SpinDoc));
});

export const getCooldown = onCall(async (req) => {
  const uid = requireAuth(req);

  const userSpins = db.collection(paths.userSpins(uid));
  const lastSnap = await userSpins.orderBy('timestamp', 'desc').limit(1).get();

  const nowMs = Timestamp.now().toMillis();

  if (lastSnap.empty) {
    return { remainingMs: 0, nextAllowedAt: null };
  }

  const last = lastSnap.docs[0].data() as SpinDoc;
  const nextMs = last.nextAllowedAt.toMillis();
  const remainingMs = Math.max(0, nextMs - nowMs);

  return { remainingMs, nextAllowedAt: nextMs };
});
