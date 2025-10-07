'use client';

import React, { useMemo } from 'react';
import { TAILWIND_COLORS, COLOR_FAMILIES } from '../lib/tailwindPalette';
import { useThemeDesign } from '../lib/ThemeDesignContext';

type ColorToken = {
  label: string;
  key: string;
  value: string;
};

type ColorSection = {
  title: string;
  fields: ColorToken[];
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  // Use native details/summary for a simple collapsible UI
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

function TailwindColorPopover({ onSelect }: { onSelect: (hex: string) => void }) {
  const [query, setQuery] = React.useState('');
  
  const filteredFamilies = useMemo(() => {
    if (!query.trim()) {
      return COLOR_FAMILIES;
    }
    
    return COLOR_FAMILIES.map(family => ({
      ...family,
      colors: family.colors.filter(color =>
        color.name.toLowerCase().includes(query.toLowerCase()) ||
        color.hex.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(family => family.colors.length > 0);
  }, [query]);

  return (
    <div className="absolute right-0 top-[110%] z-10 w-72 rounded-xl border p-3 shadow" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm" style={{ color: '#403f3e' }}>Tailwind v4</div>
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-8 rounded-md border px-2 text-sm mb-2"
        placeholder="Search Tailwind colors..."
        style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e' }}
      />
      <div className="max-h-64 overflow-auto">
        {filteredFamilies.map((family) => (
          <div key={family.name}>
            <div className="sticky top-0 px-2 py-1 text-xs font-medium border-b mb-1" style={{ backgroundColor: '#f2e8dc', color: '#403f3e', borderColor: '#e8ddd0' }}>
              {family.name}
            </div>
            {family.colors.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => onSelect(color.hex)}
                className="w-full flex items-center gap-3 px-2 py-1 rounded-lg mb-1 hover:bg-opacity-80"
                style={{ backgroundColor: '#fffaf3', color: '#403f3e' }}
              >
                <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: color.hex, borderColor: '#e8ddd0' }} />
                <span className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{color.name}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorField({ token, onChange }: { token: ColorToken; onChange: (next: string) => void }) {
  const [showTW, setShowTW] = React.useState(false);
  return (
    <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 mb-3">
      <div className="h-9 w-9 rounded-md border" style={{ backgroundColor: token.value, borderColor: '#e8ddd0' }} />
      <div className="relative">
        <input
          value={token.value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 rounded-md border px-3 text-sm"
          style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
          placeholder="#000000"
        />
        {showTW && (
          <TailwindColorPopover
            onSelect={(hex) => {
              onChange(hex);
              setShowTW(false);
            }}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => setShowTW((v) => !v)}
        className="h-9 w-9 rounded-md border flex items-center justify-center"
        style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3', color: '#403f3e' }}
        aria-label="Open Tailwind palette"
      >
        ≈
      </button>
    </div>
  );
}

export default function ThemeColorsEditor() {
  const { tokens, setTokens } = useThemeDesign();
  const sections: ColorSection[] = [
    {
      title: 'Primary Colors',
      fields: [
        { label: 'Primary', key: 'primary', value: tokens.colors.primary },
        { label: 'Primary Foreground', key: 'primaryForeground', value: tokens.colors.primaryForeground },
      ],
    },
    {
      title: 'Secondary Colors',
      fields: [
        { label: 'Secondary', key: 'secondary', value: tokens.colors.secondary },
        { label: 'Secondary Foreground', key: 'secondaryForeground', value: tokens.colors.secondaryForeground },
      ],
    },
    {
      title: 'Accent Colors',
      fields: [
        { label: 'Accent', key: 'accent', value: tokens.colors.accent },
        { label: 'Accent Foreground', key: 'accentForeground', value: tokens.colors.accentForeground },
      ],
    },
    {
      title: 'Base Colors',
      fields: [
        { label: 'Background', key: 'background', value: tokens.colors.background },
        { label: 'Foreground', key: 'foreground', value: tokens.colors.foreground },
      ],
    },
    {
      title: 'Card Colors',
      fields: [
        { label: 'Card Background', key: 'cardBackground', value: tokens.colors.cardBackground },
        { label: 'Card Foreground', key: 'cardForeground', value: tokens.colors.cardForeground },
      ],
    },
    {
      title: 'Popover Colors',
      fields: [
        { label: 'Popover Background', key: 'popoverBackground', value: tokens.colors.popoverBackground },
        { label: 'Popover Foreground', key: 'popoverForeground', value: tokens.colors.popoverForeground },
      ],
    },
    {
      title: 'Muted Colors',
      fields: [
        { label: 'Muted', key: 'muted', value: tokens.colors.muted },
        { label: 'Muted Foreground', key: 'mutedForeground', value: tokens.colors.mutedForeground },
      ],
    },
    {
      title: 'Destructive Colors',
      fields: [
        { label: 'Destructive', key: 'destructive', value: tokens.colors.destructive },
        { label: 'Destructive Foreground', key: 'destructiveForeground', value: tokens.colors.destructiveForeground },
      ],
    },
    {
      title: 'Border & Input Colors',
      fields: [
        { label: 'Border', key: 'border', value: tokens.colors.border },
        { label: 'Input', key: 'input', value: tokens.colors.input },
        { label: 'Ring', key: 'ring', value: tokens.colors.ring },
      ],
    },
    {
      title: 'Chart Colors',
      fields: [
        { label: 'Chart 1', key: 'chart1', value: tokens.colors.chart1 },
        { label: 'Chart 2', key: 'chart2', value: tokens.colors.chart2 },
        { label: 'Chart 3', key: 'chart3', value: tokens.colors.chart3 },
        { label: 'Chart 4', key: 'chart4', value: tokens.colors.chart4 },
        { label: 'Chart 5', key: 'chart5', value: tokens.colors.chart5 },
      ],
    },
    {
      title: 'Sidebar Colors',
      fields: [
        { label: 'Sidebar Background', key: 'sidebarBackground', value: tokens.colors.sidebarBackground },
        { label: 'Sidebar Foreground', key: 'sidebarForeground', value: tokens.colors.sidebarForeground },
        { label: 'Sidebar Primary', key: 'sidebarPrimary', value: tokens.colors.sidebarPrimary },
        { label: 'Sidebar Primary Foreground', key: 'sidebarPrimaryForeground', value: tokens.colors.sidebarPrimaryForeground },
        { label: 'Sidebar Accent', key: 'sidebarAccent', value: tokens.colors.sidebarAccent },
        { label: 'Sidebar Accent Foreground', key: 'sidebarAccentForeground', value: tokens.colors.sidebarAccentForeground },
        { label: 'Sidebar Border', key: 'sidebarBorder', value: tokens.colors.sidebarBorder },
        { label: 'Sidebar Ring', key: 'sidebarRing', value: tokens.colors.sidebarRing },
      ],
    },
  ];

  const setField = (_sectionIdx: number, fieldIdx: number, next: string, sec: ColorSection) => {
    const key = sec.fields[fieldIdx].key;
    setTokens((prev) => ({ ...prev, colors: { ...prev.colors, [key]: next } }));
  };

  return (
    <div>

      {sections.map((sec, si) => (
        <Section key={sec.title} title={sec.title}>
          <div className="grid grid-cols-1 gap-4">
            {sec.fields.map((field, fi) => (
              <div key={field.label}>
                <label className="text-sm mb-1 block" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>{field.label}</label>
                <ColorField token={field} onChange={(next) => setField(si, fi, next, sec)} />
              </div>
            ))}
          </div>
        </Section>
      ))}

      <div className="mt-8 flex justify-end">
        <button
          className="px-4 py-2 rounded-full text-sm"
          style={{ backgroundColor: '#403f3e', color: '#fffaf3', fontFamily: 'Raleway, sans-serif' }}
          onClick={() => navigator.clipboard.writeText(JSON.stringify(tokens.colors, null, 2))}
        >
          Code
        </button>
      </div>
    </div>
  );
}