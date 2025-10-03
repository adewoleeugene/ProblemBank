'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CommandPalette from './CommandPalette';

interface NavigationProps {
  logoText?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  logoText = 'ProblemBank',
}) => {
  const pathname = usePathname();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const items = [
    { label: 'Ideas', href: '/ideas' },
    { label: 'Resources', href: '/resources' },
    { label: 'Find Team', href: '/find-a-team' },
    { label: 'About', href: '/about' },
  ] as const;

  const isActive = (href: string) => href !== '#' && pathname.startsWith(href);

  // Handle ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#f9f2e9] border-b border-[#e8ddd0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center">
            <Link href="/" aria-label="Go to home" className="flex items-center space-x-2">
              <img 
                src="/cf-logo.svg" 
                alt="CF Logo" 
                className="w-8 h-8"
              />
              <span
                className="text-[22px] inline-block"
                style={{ fontFamily: 'Decoy, serif', color: '#403f3e' }}
              >
                {logoText}
              </span>
            </Link>
          </div>

          {/* Center: Menu (visible on all breakpoints, centered) */}
          <div className="flex justify-center items-center gap-8">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={
                    `px-3 py-2 rounded-full transition-colors ${active ? 'ring-2 ring-[#d8cdbc]' : ''}`
                  }
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    fontWeight: 500,
                    color: '#403f3e',
                    backgroundColor: active ? '#f2e8dc' : 'transparent',
                    border: active ? '1px solid #d8cdbc' : 'none',
                    transform: active ? 'rotate(-2deg)' : undefined,
                  }}
                >
                  <span className="px-2 py-1 rounded-full hover:bg-[#fffaf3] hover:text-[#1e1e1e]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right: Search pill (interactive) */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 bg-[#fffaf3] border border-[#e8ddd0] rounded-full shadow-sm px-4 py-2 w-40 md:w-64 shrink-0 hover:bg-[#f2e8dc] transition-colors"
            >
              {/* Magnifying glass icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"
                  stroke="#403f3e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Placeholder text */}
              <span className="text-sm" style={{ color: '#403f3e' }}>Search…</span>
              {/* Keycap */}
              <span
                className="ml-auto rounded-md px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: '#e8ddd0',
                  border: '1px solid #e8ddd0',
                  color: '#403f3e',
                }}
              >
                ⌘ K
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </nav>
  );
};

export default Navigation;