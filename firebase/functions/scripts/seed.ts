import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import { paths, WheelConfigDoc } from '../src/domain';

// Explicit project id to avoid "Unable to detect Project Id"
const PROJECT_ID =
  process.env.GOOGLE_CLOUD_PROJECT ||
  process.env.GCLOUD_PROJECT ||
  "demo-sobeys-wheel";

// Safety guard: seed only against emulator or demo-* project
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
if (!isEmulator && !PROJECT_ID.startsWith("demo-")) {
  console.error("Refusing to seed outside emulator or demo-* project.");
  process.exit(1);
}

initializeApp({ projectId: PROJECT_ID });

const db = getFirestore();

/** Runtime validation to ensure we always write a valid 8-segment config. */
function validateConfig(cfg: WheelConfigDoc) {
  if (!cfg || !Array.isArray(cfg.segments) || cfg.segments.length !== 8) {
    throw new Error('wheelConfig must contain exactly 8 segments');
  }
  for (let i = 0; i < cfg.segments.length; i++) {
    const s = cfg.segments[i];
    if (typeof s.label !== 'string' || !s.label.trim()) {
      throw new Error(`segment[${i}] label must be a non-empty string`);
    }
    if (typeof s.weight !== 'number' || !Number.isFinite(s.weight) || s.weight <= 0) {
      throw new Error(`segment[${i}] weight must be a positive finite number`);
    }
  }
}

(async () => {
  try {
    const config: WheelConfigDoc = {
      cooldownMs: 60_000,
      segments: [
        {
          label: "+50 Points",
          prize: { type: "points", amount: 50 },
          weight: 1.5,
          textColor: "#fff",
          color: "#F94144",
        },
        {
          label: "Try Again",
          prize: { type: "none" },
          weight: 1.8,
        },
        {
          label: "+100 Points",
          prize: { type: "points", amount: 100 },
          weight: 1,
        },
        {
          label: "5% dairy",
          prize: { type: "coupon", amount: 5, category: "dairy" },
          weight: 1.2,
        },
        {
          label: "+200 pts",
          prize: { type: "points", amount: 200 },
          weight: 0.8,
        },
        {
          label: "No win",
          prize: { type: "none" },
          weight: 1.8,
        },
        {
          label: "10% all",
          prize: { type: "coupon", amount: 10, category: "all" },
          weight: 0.6,
        },
        {
          label: "+500 pts",
          prize: { type: "points", amount: 500 },
          weight: 0.2,
        },
      ]
    };

    validateConfig(config);

    await db.doc(paths.wheelConfigDoc).set(config, { merge: false });
    console.log(`✅ Seeded ${paths.wheelConfigDoc} in project ${PROJECT_ID}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
})();
