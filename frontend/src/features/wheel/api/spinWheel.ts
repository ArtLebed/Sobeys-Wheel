import type { SpinResponse, SpinReq } from '../types';

import { callFn } from '@/shared/services';

export const spinWheel = callFn<SpinReq, SpinResponse>('spinWheel');
