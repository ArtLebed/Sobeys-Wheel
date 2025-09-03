export const SECOND = 1000;

export const SIZE = 280;

export const TAU = Math.PI * 2;

export const friendly = {
  none: {
    title: 'Not this spin...',
    subtitle: 'but who knows about the next?'
  },
  points:  (points: number) => ({
    title: `+${points} Scene+ Points 🎉`,
    subtitle: 'Login to claim your prize',
  }),
  coupon:  (amount: number, category?: string) => ({
    title: `Coupon unlocked! 🛍️`,
    subtitle: `Login to claim your ${amount}% off${category ? ` on ${category} products` : ''}`,
  }),
};

export const TITLE_MODAL_LOSE = "Try again later";
