import type { SpinSuccess, WheelSegment } from '../types';

export type ResultModalProps = {
  visible: boolean;
  result: SpinSuccess | null;
  onClose: () => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
};

export type WheelFaceProps = {
  size?: number;
  segments: WheelSegment[];
};
