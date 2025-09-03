import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@/shared/theme';

const qc = new QueryClient();

type AppProvidersProps = {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={qc}>
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
