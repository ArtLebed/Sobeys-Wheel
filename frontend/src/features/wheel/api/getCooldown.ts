import type { GetCooldownRes } from '../types';

import { callFn } from '@/shared/services';

export const getCooldown = callFn<void, GetCooldownRes>('getCooldown');
