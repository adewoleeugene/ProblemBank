'use client';

import React from 'react';
import { useThemeDesign } from '../lib/ThemeDesignContext';

export default function ThemePreview() {
  const { tokens } = useThemeDesign();
  const c = tokens.colors;
  const t = tokens.typography;

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl border p-6" style={{ backgroundColor: c.cardBackground, borderColor: c.border, color: c.cardForeground }}>
        <h2 className="text-xl mb-3" style={{ fontFamily: t.sans || 'Raleway, sans-serif' }}>Component Preview</h2>
        <p className="text-sm mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>Buttons, cards and text styled from your tokens.</p>
        <div className="flex items-center gap-3">
          <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: c.accent, color: c.accentForeground, borderColor: c.border }}>Accent</button>
          <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: c.primary, color: c.primaryForeground, borderColor: c.border }}>Primary</button>
          <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: c.secondary, color: c.secondaryForeground, borderColor: c.border }}>Secondary</button>
        </div>
      </div>
      <div className="rounded-2xl border p-6" style={{ backgroundColor: c.popoverBackground, borderColor: c.border, color: c.popoverForeground }}>
        <h2 className="text-xl mb-3" style={{ fontFamily: t.serif || 'Decoy, serif' }}>Typography Preview</h2>
        <p className="mb-2" style={{ fontFamily: t.sans || 'Raleway, sans-serif', letterSpacing: `${t.letterSpacingEm}em` }}>The quick brown fox jumps over the lazy dog.</p>
        <code className="block mt-3 rounded-md border p-3 text-xs" style={{ borderColor: c.border, backgroundColor: c.muted, color: c.mutedForeground }}>
          background: {c.background} • foreground: {c.foreground}
        </code>
      </div>
    </div>
  );
}