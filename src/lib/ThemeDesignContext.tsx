'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeTokens = {
  colors: Record<string, string>;
  typography: {
    sans?: string;
    serif?: string;
    mono?: string;
    letterSpacingEm: number;
  };
  other: {
    radiusRem: number;
    shadow: {
      color: string;
      opacity: number; // 0..1
      blurPx: number;
      spreadPx: number;
      offsetX: number;
      offsetY: number;
    };
  };
};

export const defaultTokens: ThemeTokens = {
  colors: {
    primary: '#262626',
    primaryForeground: '#FFFFFF',
    secondary: '#EDE8E1',
    secondaryForeground: '#262626',
    accent: '#FBC75B',
    accentForeground: '#262626',
    background: '#F8F4EF',
    foreground: '#262626',
    cardBackground: '#EDE8E1',
    cardForeground: '#262626',
    popoverBackground: '#FFFFFF',
    popoverForeground: '#262626',
    muted: '#F3EEE8',
    mutedForeground: '#525252',
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: '#DCD5CC',
    input: '#EDE8E1',
    ring: '#262626',
    chart1: '#262626',
    chart2: '#FBC75B',
    chart3: '#A3A3A3',
    chart4: '#D4D4D4',
    chart5: '#E5E5E5',
    sidebarBackground: '#F8F4EF',
    sidebarForeground: '#262626',
    sidebarPrimary: '#262626',
    sidebarPrimaryForeground: '#FFFFFF',
    sidebarAccent: '#EDE8E1',
    sidebarAccentForeground: '#262626',
    sidebarBorder: '#DCD5CC',
    sidebarRing: '#262626',
  },
  typography: {
    sans: 'Inter',
    serif: 'EB Garamond',
    mono: undefined,
    letterSpacingEm: 0,
  },
  other: {
    radiusRem: 1,
    shadow: {
      color: '#000000',
      opacity: 0.05,
      blurPx: 0.5,
      spreadPx: 0,
      offsetX: 0,
      offsetY: 0.125,
    },
  },
};

const ThemeDesignContext = createContext<{
  tokens: ThemeTokens;
  setTokens: React.Dispatch<React.SetStateAction<ThemeTokens>>;
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}>({ tokens: defaultTokens, setTokens: () => {}, mode: 'light', setMode: () => {} });

export function ThemeDesignProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<ThemeTokens>(defaultTokens);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const value = useMemo(() => ({ tokens, setTokens, mode, setMode }), [tokens, mode]);
  return <ThemeDesignContext.Provider value={value}>{children}</ThemeDesignContext.Provider>;
}

export function useThemeDesign() {
  return useContext(ThemeDesignContext);
}