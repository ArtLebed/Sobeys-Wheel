import { HttpsError } from 'firebase-functions/https';

import { SpinReq } from '../domain/types';

/** Throws 401 if the caller is not authenticated. */
export function requireAuth(ctx: { auth?: { uid?: string } }) {
  const uid = ctx.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Auth required");
  }
  return uid;
}

/** Narrow unknown input into a strongly-typed SpinReq (no 'any'). */
export function parseSpinReq(data: unknown): SpinReq {
  // ensure payload is a non-null object
  if (data === null || typeof data !== "object") {
    throw new HttpsError("invalid-argument", "Request payload must be an object");
  }
  const rec = data as Record<string, unknown>;
  if (typeof rec.clientRequestId !== "string") {
    throw new HttpsError("invalid-argument", "clientRequestId must be a string");
  }
  return { clientRequestId: rec.clientRequestId };
}

/** Validate and normalize clientRequestId to a Firestore-safe token. */
export function validateClientRequestId(input: string): string {
  const id = input.trim();
  // allow only URL/Firestore-safe token-like ids (uuid, nanoid, etc.)
  if (id.length < 8 || id.length > 64) {
    throw new HttpsError("invalid-argument", "clientRequestId must be 8..64 characters long");
  }
  if (!/^[A-Za-z0-9_-]+$/.test(id)) {
    throw new HttpsError("invalid-argument", "clientRequestId may contain only A–Z, a–z, 0–9, _ and -");
  }
  return id;
}

/** True if value is a positive finite number. Narrows type to `number`. */
export function isPositiveFiniteNumber(x: unknown): x is number {
  return typeof x === "number" && Number.isFinite(x) && x > 0;
}
