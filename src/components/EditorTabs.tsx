'use client';

import React from 'react';

type TabKey = 'colors' | 'typography' | 'other' | 'generate';

export default function EditorTabs({ tab, onChange }: { tab: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'colors', label: 'Colors' },
    { key: 'typography', label: 'Typography' },
    { key: 'other', label: 'Other' },
    { key: 'generate', label: 'Generate' },
  ];

  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 px-4 py-3 border-b"
      style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className="h-9 px-3 rounded-md border"
          style={{
            borderColor: '#d8cdbc',
            backgroundColor: tab === t.key ? '#f2e8dc' : '#fffaf3',
            color: '#403f3e',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}