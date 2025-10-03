'use client';

import React, { useEffect, useMemo, useState } from 'react';

type GoogleFont = {
  family: string;
  category: 'sans-serif' | 'serif' | 'monospace' | string;
};

function InfoBox() {
  return (
    <div className="mb-6 rounded-2xl border p-4" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      <p className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
        To use custom fonts, embed them in your project. See
        {' '}
        <a href="https://tailwindcss.com/docs/font-family" target="_blank" rel="noreferrer" className="underline">Tailwind docs</a>
        {' '}for details.
      </p>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="mb-6 border rounded-2xl" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      <summary className="px-4 py-3 border-b list-none flex items-center justify-between cursor-pointer" style={{ borderColor: '#e8ddd0' }}>
        <h3 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>{title}</h3>
        <span aria-hidden className="text-sm" style={{ color: '#403f3e' }}>▾</span>
      </summary>
      <div className="p-4">{children}</div>
    </details>
  );
}

function SelectWithSearch({
  label,
  value,
  onChange,
  fonts,
  category,
}: {
  label: string;
  value?: string;
  onChange: (next?: string) => void;
  fonts: GoogleFont[];
  category: 'sans-serif' | 'serif' | 'monospace';
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return fonts
      .filter((f) => f.category === category)
      .filter((f) => f.family.toLowerCase().includes(query.toLowerCase()));
  }, [fonts, category, query]);

  return (
    <div className="mb-4">
      <label className="text-sm mb-1 block" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>{label}</label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-11 rounded-xl border px-4 text-left flex items-center justify-between"
        style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e' }}
      >
        <span>{value || `Choose a ${category} font...`}</span>
        <span aria-hidden>▾</span>
      </button>
      {open && (
        <div className="mt-2 rounded-xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
          <input
            className="w-full h-9 rounded-md border px-3 text-sm mb-2"
            placeholder="Search Google fonts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e' }}
          />
          <div className="max-h-56 overflow-auto">
            {filtered.map((f) => (
              <button
                key={`${f.family}-${f.category}`}
                type="button"
                onClick={() => {
                  onChange(f.family);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg mb-1"
                style={{ backgroundColor: value === f.family ? '#FBC75B' : '#fffaf3', color: '#403f3e' }}
              >
                <div className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>{f.family}</div>
                <div className="text-xs" style={{ color: '#6b6b6b' }}>{f.category}</div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-sm px-2 py-1" style={{ color: '#6b6b6b' }}>No fonts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThemeTypographyEditor() {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [sans, setSans] = useState<string | undefined>('Inter');
  const [serif, setSerif] = useState<string | undefined>('EB Garamond');
  const [mono, setMono] = useState<string | undefined>(undefined);
  const [letterSpacingEm, setLetterSpacingEm] = useState<number>(0);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
    async function fetchFonts() {
      try {
        let url = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity';
        if (key) {
          url += `&key=${key}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch fonts');
        }
        const json = await res.json();
        const items: GoogleFont[] = (json.items || []).map((it: any) => ({ family: it.family, category: it.category }));
        setFonts(items);
      } catch (e) {
        // Fallback minimal list if API fails
        setFonts([
          { family: 'Inter', category: 'sans-serif' },
          { family: 'Roboto', category: 'sans-serif' },
          { family: 'Open Sans', category: 'sans-serif' },
          { family: 'EB Garamond', category: 'serif' },
          { family: 'Merriweather', category: 'serif' },
          { family: 'Playfair Display', category: 'serif' },
          { family: 'Fira Code', category: 'monospace' },
          { family: 'Roboto Mono', category: 'monospace' },
          { family: 'Source Code Pro', category: 'monospace' },
        ]);
      }
    }
    fetchFonts();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-6">
      <div className="mb-2">
        <h2 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Typography</h2>
      </div>
      <InfoBox />

      <Section title="Font Family">
        <SelectWithSearch label="Sans-Serif Font" value={sans} onChange={setSans} fonts={fonts} category="sans-serif" />
        <SelectWithSearch label="Serif Font" value={serif} onChange={setSerif} fonts={fonts} category="serif" />
        <SelectWithSearch label="Monospace Font" value={mono} onChange={setMono} fonts={fonts} category="monospace" />
      </Section>

      <Section title="Letter Spacing">
        <div className="mb-2 text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Letter Spacing</div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="range"
              min={-0.1}
              max={0.5}
              step={0.01}
              value={letterSpacingEm}
              onChange={(e) => setLetterSpacingEm(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="h-9 px-3 rounded-xl border flex items-center" style={{ borderColor: '#e8ddd0', backgroundColor: '#fdf8f1', color: '#403f3e' }}>
            {letterSpacingEm.toFixed(2)}
          </div>
          <div className="text-sm" style={{ color: '#6b6b6b' }}>em</div>
        </div>
      </Section>
    </div>
  );
}