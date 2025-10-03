'use client';

import React from 'react';
import { useThemeDesign } from '../lib/ThemeDesignContext';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details open className="mb-6 border rounded-2xl" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      <summary className="px-4 py-3 border-b list-none flex items-center justify-between cursor-pointer" style={{ borderColor: '#e8ddd0' }}>
        <h3 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>{title}</h3>
        <span aria-hidden className="text-sm" style={{ color: '#403f3e' }}>▾</span>
      </summary>
      <div className="p-4">{children}</div>
    </details>
  );
}

export default function ThemeOtherEditor() {
  const { tokens, setTokens } = useThemeDesign();
  const s = tokens.other.shadow;

  return (
    <div className="mt-4">
      <Section title="Border Radius">
        <div className="grid grid-cols-1 gap-3">
          <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Radius (rem)</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={tokens.other.radiusRem}
            onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, radiusRem: Number(e.target.value) } }))}
          />
          <div className="rounded-xl border p-4" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
            <div className="h-12 w-full rounded" style={{ backgroundColor: tokens.colors.cardBackground, borderRadius: `${tokens.other.radiusRem}rem`, border: `1px solid ${tokens.colors.border}` }} />
          </div>
        </div>
      </Section>

      <Section title="Shadow">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Color</label>
            <input
              value={s.color}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, color: e.target.value } } }))}
              className="w-full h-9 rounded-md border px-3 text-sm"
              style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e' }}
              placeholder="#000000"
            />
          </div>
          <div>
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Opacity</label>
            <input type="range" min={0} max={1} step={0.01} value={s.opacity}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, opacity: Number(e.target.value) } } }))} />
          </div>
          <div>
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Blur (px)</label>
            <input type="range" min={0} max={24} step={0.5} value={s.blurPx}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, blurPx: Number(e.target.value) } } }))} />
          </div>
          <div>
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Spread (px)</label>
            <input type="range" min={-6} max={6} step={0.5} value={s.spreadPx}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, spreadPx: Number(e.target.value) } } }))} />
          </div>
          <div>
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Offset X (px)</label>
            <input type="range" min={-12} max={12} step={0.5} value={s.offsetX}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, offsetX: Number(e.target.value) } } }))} />
          </div>
          <div>
            <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Offset Y (px)</label>
            <input type="range" min={-12} max={12} step={0.5} value={s.offsetY}
              onChange={(e) => setTokens((prev) => ({ ...prev, other: { ...prev.other, shadow: { ...prev.other.shadow, offsetY: Number(e.target.value) } } }))} />
          </div>
        </div>

        <div className="rounded-xl border p-4 mt-4" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
          <div
            className="h-16 w-full rounded"
            style={{
              backgroundColor: tokens.colors.cardBackground,
              borderRadius: `${tokens.other.radiusRem}rem`,
              border: `1px solid ${tokens.colors.border}`,
              boxShadow: `${s.offsetX}px ${s.offsetY}px ${s.blurPx}px ${s.spreadPx}px ${s.color}${Math.round(s.opacity * 255).toString(16).padStart(2, '0')}`,
            }}
          />
        </div>
      </Section>
    </div>
  );
}