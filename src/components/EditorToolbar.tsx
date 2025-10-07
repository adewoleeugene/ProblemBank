'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { defaultTokens, useThemeDesign } from '../lib/ThemeDesignContext';

export default function EditorToolbar() {
  const router = useRouter();
  const { tokens, setTokens, mode, setMode } = useThemeDesign();

  const reset = () => setTokens(defaultTokens);

  const toggleMode = () => {
    if (mode === 'light') {
      // Simple dark theme mapping
      const dark = { ...tokens.colors };
      dark.background = '#1e1e1e';
      dark.foreground = '#ffffff';
      dark.cardBackground = '#262626';
      dark.cardForeground = '#ffffff';
      dark.popoverBackground = '#262626';
      dark.popoverForeground = '#ffffff';
      dark.border = '#403f3e';
      dark.input = '#2a2a2a';
      dark.ring = '#ffffff';
      dark.primary = '#ffffff';
      dark.primaryForeground = '#1e1e1e';
      dark.secondary = '#403f3e';
      dark.secondaryForeground = '#ffffff';
      setTokens((prev) => ({ ...prev, colors: dark }));
      setMode('dark');
    } else {
      setTokens(defaultTokens);
      setMode('light');
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      <button
        type="button"
        onClick={() => router.back()}
        className="h-9 px-3 rounded-md border"
        style={{ borderColor: '#d8cdbc', backgroundColor: '#f2e8dc', color: '#403f3e' }}
        aria-label="Back"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => window.history.forward()}
        className="h-9 px-3 rounded-md border"
        style={{ borderColor: '#d8cdbc', backgroundColor: '#f2e8dc', color: '#403f3e' }}
        aria-label="Forward"
      >
        →
      </button>
      <div className="flex-1" />
      <button
        type="button"
        onClick={reset}
        className="h-9 px-3 rounded-md border"
        style={{ borderColor: '#d8cdbc', backgroundColor: '#fffaf3', color: '#403f3e' }}
      >
        Reset
      </button>
      <button
        type="button"
        onClick={toggleMode}
        className="h-9 px-3 rounded-md border"
        style={{ borderColor: '#d8cdbc', backgroundColor: '#fffaf3', color: '#403f3e' }}
      >
        {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}