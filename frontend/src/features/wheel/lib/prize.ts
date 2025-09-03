import type { Prize } from '../types';
import { friendly } from '../constants';

export function prizeToCopy(prize: Prize) {
  switch (prize.type) {
    case 'points': return friendly.points(prize.amount);
    case 'coupon': return friendly.coupon(prize.amount, prize.category);
    case 'none':   return friendly.none;
  }
}
