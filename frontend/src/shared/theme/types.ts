import {ViewStyle} from "react-native";

export type ThemeTypes = {
  colors: {
    brand: string;
    onBrand: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    disabledBg: string;
    disabledBorder: string;
    disabledText: string;
    error: string;
  };
  radius: { sm: number; md: number; lg: number; pill: number };
  shadow: {
    // Tailwind: shadow-[0_0_4px_0_rgba(0,0,0,0.25)]
    card: ViewStyle;
  };
  border: {
    thin: { borderWidth: number; borderColor: string };
  };
  wheel: {
    ring: string;        // wheel outline
    hub: string;         // wheel center
    pointer: string;     // pointer color
    palette: string[];   // fallback slice colors
  };
};
