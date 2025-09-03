import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/types';

export type Prize =
  | { type: 'points'; amount: number }
  | { type: 'coupon'; amount: number; category: string }
  | { type: 'none' };

export type WheelSegment = {
  label: string;
  prize: Prize;
  weight: number;
  color?: string;
  textColor?: string;
};

export type WheelConfig = {
  cooldownMs: number;
  segments: WheelSegment[];
};

export type SpinReq = { clientRequestId: string };

export type SpinSuccess = {
  status: 'OK';
  spinId: string;
  segmentIndex: number;
  prize: Prize;
  label: string;
  timestamp: number;
  remainingMs: number;
};

type SpinCooldown = {
  status: 'COOLDOWN';
  remainingMs: number;
};
export type SpinResponse = SpinSuccess | SpinCooldown;

export type UseSpinProps = {
  onResult?: (res: SpinSuccess) => void;
  setCooldownFromServer: (ms: number) => void;
}

export type GetCooldownRes = {
  remainingMs: number;
};

export type WheelProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}
