import type { Prize } from '@/features/wheel';

export type HistoryReq = {
  limit?: number;
};

export type HistoryResp = {
  spinId: string;
  label: string;
  prize: Prize;
  segmentIndex: number;
  timestamp: number;
};

export type HistoryCardItem = {
  item: HistoryResp;
}
