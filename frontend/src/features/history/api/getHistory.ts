import { HistoryReq, HistoryResp } from '../types.ts';

import { callFn } from '@/shared/services';

export const getHistory = callFn<HistoryReq, HistoryResp[]>('getHistory');
