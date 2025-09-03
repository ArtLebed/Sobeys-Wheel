import type { AuthMode } from '@/features/auth';

export type RootStackParamList = {
  Tabs: undefined;
  AuthComingSoon: { mode: AuthMode };
};

export type TabRouteName = 'Wheel' | 'History' | 'Settings';
