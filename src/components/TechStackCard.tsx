'use client';

import React from 'react';
import { TechStackItem } from '@/lib/airtable';

interface TechStackCardProps {
  item: TechStackItem;
  index: number;
}

// Featured card background/rotation utilities (same as Builder's Kits)
function getBackgroundForGlobalIndex(index1Based: number): string {
  const LIGHT = '#fffaf3';
  const DARK = '#f2e8dc';
  const block = Math.floor((index1Based - 1) / 4);
  const startIsLight = block % 2 === 0;
  const pos = (index1Based - 1) % 4;
  const isLight = startIsLight ? (pos % 2 === 0) : (pos % 2 === 1);
  return isLight ? LIGHT : DARK;
}

function getRotationAngleForGlobalIndex(index1Based: number): number {
  const baseAngles = [-2, 1.4, -1.2, 1.8];
  const pos = (index1Based - 1) % 4;
  const block = Math.floor((index1Based - 1) / 4);
  const angle = baseAngles[pos];
  return block % 2 === 0 ? angle : -angle;
}

const TechStackCard: React.FC<TechStackCardProps> = ({ item, index }) => {
  return (
    <div className="block">
      <div
        className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px] cursor-pointer"
        style={{
          height: '320px',
          backgroundColor: getBackgroundForGlobalIndex(index + 1),
          transform: `rotate(${getRotationAngleForGlobalIndex(index + 1)}deg)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onClick={() => item.url && window.open(item.url, '_blank', 'noopener,noreferrer')}
      >
        {/* Speckled texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)',
            backgroundSize: '200px 200px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Card content */}
        <div className="relative flex flex-col h-full px-6 pt-6 pb-6">
          <div>
            <div>
              <h3
                className="text-2xl mb-3 text-center"
                style={{ fontFamily: 'Decoy', fontWeight: 500, color: '#403f3e' }}
              >
                {item.name}
              </h3>
            </div>
            <div>
              <div>
                <p
                  className="text-sm leading-relaxed text-center"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#403f3e',
                    fontWeight: 600,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.description}
                </p>

              </div>
            </div>
          </div>

          <div className="mt-auto pt-4">
            {/* Tags */}
            {item.category && item.category.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {item.category.map((cat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full border text-xs"
                    style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: '#fffaf3' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2">
              {item.url ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                  }}
                  className="group relative overflow-hidden w-full py-3 rounded-full bg-black text-white font-medium text-sm whitespace-nowrap transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)', backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
                  <span className="relative z-10">Open Docs <span aria-hidden style={{ marginLeft: 8 }}>→</span></span>
                </button>
              ) : (
                <div 
                  className="w-full py-3 rounded-full text-sm text-center"
                  style={{ 
                    backgroundColor: '#e8ddd0', 
                    color: '#666',
                    fontFamily: 'Raleway, sans-serif'
                  }}
                >
                  No URL available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackCard;
