'use client';

import React, { useState } from 'react';
import { useThemeDesign } from '../lib/ThemeDesignContext';

type ViewKey = 'cards' | 'dashboard' | 'mail' | 'pricing' | 'palette';

export default function PreviewTabs() {
  const [view, setView] = useState<ViewKey>('cards');
  const { tokens } = useThemeDesign();
  const c = tokens.colors;
  const t = tokens.typography;

  const tabs: { key: ViewKey; label: string }[] = [
    { key: 'cards', label: 'Cards' },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'mail', label: 'Mail' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'palette', label: 'Color Palette' },
  ];

  return (
    <div className="mt-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: '#e8ddd0', backgroundColor: '#fffaf3' }}>
        {tabs.map((t_) => (
          <button key={t_.key} type="button" onClick={() => setView(t_.key)}
            className="h-9 px-3 rounded-md border"
            style={{ borderColor: '#d8cdbc', backgroundColor: view === t_.key ? '#f2e8dc' : '#fffaf3', color: '#403f3e' }}>
            {t_.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {view === 'cards' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stats Cards */}
            <div className="rounded-2xl border p-4" style={{ backgroundColor: c.cardBackground, borderColor: c.border, color: c.cardForeground }}>
              <div className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>Total Revenue</div>
              <div className="text-2xl md:text-3xl mt-1" style={{ fontFamily: t.sans || 'Raleway, sans-serif' }}>$15,231.89</div>
              <div className="text-xs mt-1" style={{ color: c.mutedForeground }}>+20.1% from last month</div>
              <div className="mt-3 h-24 w-full rounded border" style={{ borderColor: c.border, backgroundColor: c.popoverBackground }} />
            </div>
            <div className="rounded-2xl border p-4" style={{ backgroundColor: c.cardBackground, borderColor: c.border, color: c.cardForeground }}>
              <div className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>Subscriptions</div>
              <div className="text-2xl md:text-3xl mt-1" style={{ fontFamily: t.sans || 'Raleway, sans-serif' }}>+2,350</div>
              <div className="text-xs mt-1" style={{ color: c.mutedForeground }}>+180.1% from last month</div>
              <div className="mt-3 h-24 w-full rounded border" style={{ borderColor: c.border, backgroundColor: c.popoverBackground }} />
            </div>

            {/* Upgrade Card */}
            <div className="rounded-2xl border p-6" style={{ backgroundColor: c.cardBackground, borderColor: c.border, color: c.cardForeground }}>
              <h3 className="text-lg" style={{ fontFamily: 'Decoy, serif' }}>Upgrade your subscription</h3>
              <p className="text-sm mt-2" style={{ fontFamily: 'Raleway, sans-serif', color: c.foreground }}>
                You are currently on the free plan. Upgrade to the pro plan to get access to all features.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>Name</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} defaultValue="Evil Rabbit" />
                </div>
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>Email</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} defaultValue="example@acme.com" />
                </div>
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>MM/YY</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>Card Number</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} defaultValue="1234 1234 1234 1234" />
                </div>
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>CVC</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: c.primary, color: c.primaryForeground, borderColor: c.border }}>Upgrade</button>
                <button className="h-9 px-3 rounded-md border" style={{ backgroundColor: c.secondary, color: c.secondaryForeground, borderColor: c.border }}>Cancel</button>
              </div>
            </div>

            {/* Create Account */}
            <div className="rounded-2xl border p-6" style={{ backgroundColor: c.cardBackground, borderColor: c.border, color: c.cardForeground }}>
              <h3 className="text-lg" style={{ fontFamily: 'Decoy, serif' }}>Create an account</h3>
              <p className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>Enter your email below to create your account</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="h-9 px-3 rounded-md border w-full" style={{ backgroundColor: c.popoverBackground, color: c.foreground, borderColor: c.border }}>GitHub</button>
                <button className="h-9 px-3 rounded-md border w-full" style={{ backgroundColor: c.popoverBackground, color: c.foreground, borderColor: c.border }}>Google</button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>Email</label>
                  <input className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} defaultValue="m@example.com" />
                </div>
                <div>
                  <label className="text-xs" style={{ fontFamily: 'Raleway, sans-serif' }}>Password</label>
                  <input type="password" className="mt-1 h-9 w-full rounded-md border px-3 text-sm" style={{ borderColor: c.border, backgroundColor: c.input, color: c.foreground }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'palette' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(c).map(([k, v]) => (
              <div key={k} className="rounded-xl border p-3 flex items-center gap-3" style={{ borderColor: c.border, backgroundColor: c.popoverBackground }}>
                <span className="h-6 w-6 rounded-full border" style={{ backgroundColor: v, borderColor: c.border }} />
                <div>
                  <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: c.foreground }}>{k}</div>
                  <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: c.mutedForeground }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(view === 'dashboard' || view === 'mail' || view === 'pricing') && (
          <div className="rounded-2xl border p-6" style={{ borderColor: c.border, backgroundColor: c.cardBackground, color: c.cardForeground }}>
            <p className="text-sm" style={{ fontFamily: 'Raleway, sans-serif' }}>Preview coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}