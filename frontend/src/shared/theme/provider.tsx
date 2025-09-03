import React, {createContext, useContext} from 'react';

import { Theme } from './theme';
import type { ThemeTypes } from './types';

const ThemeCtx = createContext<ThemeTypes>(Theme);

export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }: { children:React.ReactNode }) {
  return <ThemeCtx.Provider value={Theme}>{children}</ThemeCtx.Provider>;
}
