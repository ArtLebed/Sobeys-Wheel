export type Prize = { type: 'points'; amount: number }
  | { type: 'coupon'; amount: number; category: string }
  | { type: 'none' }

export type SpinReq = Readonly<{ clientRequestId: string }>;

type Segment = {
  label: string;
  prize: Prize;
  weight: number;
  color?: string;     // background color (hex)
  textColor?: string; // label color (hex)
};

export type WheelConfigDoc = {
  cooldownMs?: number;
  segments: Segment[];
};

export type SpinDoc = {
  spinId: string;
  uid: string;
  segmentIndex: number;
  prize: Prize;
  label: string;
  timestamp: FirebaseFirestore.Timestamp;
  nextAllowedAt: FirebaseFirestore.Timestamp;
};

export type SpinDto = {
  spinId: string;
  segmentIndex: number;
  prize: Prize;
  label: string;
  timestamp: number;
  nextAllowedAt: number;
};

export type SpinResponse =
  | ({ status: 'OK' } & SpinDto)
  | ({ status: 'COOLDOWN'; nextAllowedAt: number });
