'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import BrandingKitModal from './BrandingKitModal';
import PRDKitModal from './PRDKitModal';
import PitchMasterKitModal from './PitchMasterKitModal';

interface BuildersKitsClientProps {
  problemText: string;
  solutionText: string;
  defaultBusinessName?: string;
  category?: string | null;
  pillar?: string;
  technology?: string;
}

function getCategoryIcon(label?: string | null): string {
  const CATEGORY_ICON_MAP: Record<string, string> = {
    'Feed Salone': '/images/6707c6af78a3dd5acec5512e_flower_64.webp',
    'Human Capital Development': '/images/6707c6b0778d2c6671252c5f_book_64.webp',
    'Youth Employment Scheme': '/images/6708d7e1e82809f4e18f8e05_flag_120.webp',
    'Public Service Architecture Revamp': '/images/6708d8d8f169898f7bd83ed0_heart_120.webp',
    'Tech and Infrastructure': '/images/6708d8d83911c95f3000bbfa_star_120.webp',
  };
  const FALLBACK_ICON = '/images/6708d8d8b17e6d52f343b0d3_coffee_120.webp';
  if (!label) return FALLBACK_ICON;
  return CATEGORY_ICON_MAP[label] || FALLBACK_ICON;
}

// Featured card background/rotation utilities (same behavior as ideas listing page)
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

export default function BuildersKitsClient({ problemText, solutionText, defaultBusinessName, category, pillar, technology }: BuildersKitsClientProps) {
  const [open, setOpen] = useState(false);
  const [openUIProto, setOpenUIProto] = useState(false);
  const [openPitchMaster, setOpenPitchMaster] = useState(false);
  const router = useRouter();
  const onStartBuilding = (kitTitle: string) => {
    if (kitTitle === 'Design System Kit') {
      window.open('https://tweakcn.com/editor/theme', '_blank', 'noopener,noreferrer');
      return;
    }
    if (kitTitle === 'PRD Kit') {
      setOpenUIProto(true);
      return;
    }
    if (kitTitle === 'Pitch Master Kit') {
      setOpenPitchMaster(true);
      return;
    }
    setOpen(true);
  };

  const kits = [
    {
      title: 'Design System Kit',
      description: 'Create a professional design system and visual identity.',
      tags: ['ai-tools', 'design', 'design-system'],
      items: [
        'Color palette and typography system',
        'Component library',
        'Icon set and illustrations',
      ],
      moreLabel: '+1 more',
    },
    {
      title: 'PRD Kit',
      description:
        "Create a comprehensive Product Requirements Document with user personas, features, and phased implementation plans. Get AI-ready prompts for Cursor, Trae, v0, and Bolt to build your product step-by-step.",
      tags: ['prd', 'requirements', 'ai-implementation'],
      items: [
        'User personas and stories',
        'Feature requirements',
        'Phase-by-phase AI prompts',
      ],
      moreLabel: '+2 more',
    },
    {
      title: 'Pitch Master Kit',
      description: 'Create compelling pitch presentations optimized for Gamma AI presentation software.',
      tags: ['pitch', 'gamma', 'presentation'],
      items: [
        'Gamma-ready pitch deck prompts',
        'Executive summary template',
        
      ],
      moreLabel: '+2 more',
    },
    {
      title: 'COMPLETE BRANDING KIT',
      description:
        'Create a comprehensive brand identity from strategy to visual assets. Guides you through market research, brand positioning, and visual identity creation using AI tools.',
      tags: ['branding', 'design', 'strategy'],
      items: [
        'Brand strategy document',
        'Logo and visual assets',
        'Brand voice guidelines',
      ],
      moreLabel: '+2 more',
    },
  ];

  return (
    <>
      <div className="mt-10">
        <h3
          className="text-2xl md:text-3xl text-center"
          style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}
        >
          Builder&apos;s Kits
        </h3>
        <p
          className="mt-2 text-sm md:text-base text-center"
          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
        >
          Start with these proven workflows to achieve specific outcomes
        </p>

       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 items-stretch">
  {kits.map((kit, idx) => (
    <div key={idx} className="block">
      <div
        className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px]"
        style={{
          height: '460px',
          backgroundColor: getBackgroundForGlobalIndex(idx + 1),
          transform: `rotate(${getRotationAngleForGlobalIndex(idx + 1)}deg)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {/* The main change is inside this div. We make it a flex column container to control the vertical alignment. */}
        <div className="relative flex flex-col h-full px-6 pt-6 pb-6">
          {/* Path changed: Start of a new wrapper for all content that should stay at the top. */}
          <div>
            <div>
              <h3
                className="text-2xl mb-3 text-center"
                style={{ fontFamily: 'Decoy', fontWeight: 500, color: '#403f3e' }}
              >
                {kit.title}
              </h3>
            </div>
            <div>
              {/* Path changed: The "mt-auto" was removed from here. */}
              <div>
                <p
                  className="text-sm leading-relaxed text-center"
                  style={{
                    fontFamily: 'Raleway, sans-serif',
                    color: '#403f3e',
                    fontWeight: 600,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {kit.description}
                </p>

                {/* You'll create list */}
                <div className="mt-3">
                  <div
                    className="text-center text-sm"
                    style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}
                  >
                    YOU&apos;LL CREATE:
                  </div>
                  <ul className="mt-2 space-y-1">
                    {kit.items.map((it) => (
                      <li key={it}>
                        <div className="flex justify-center items-center gap-2">
                          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M5 12l4 4 10-10" stroke="#403f3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span
                            className="text-sm text-center"
                            style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
                          >
                            {it}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {kit.moreLabel && (
                    <div
                      className="mt-2 text-center text-sm"
                      style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
                    >
                      {kit.moreLabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Path changed: End of the top content wrapper. */}

          {/* Path changed: This div now wraps the tags and button. The "mt-auto" class pushes this whole block to the bottom of the flex container. */}
          <div className="mt-auto pt-4">
            {/* Tags */}
            {kit.tags && kit.tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {kit.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full border text-xs"
                    style={{ borderColor: '#d8cdbc', color: '#403f3e', backgroundColor: '#fffaf3' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-2">
              <button
                onClick={() => onStartBuilding(kit.title)}
                className="group relative overflow-hidden w-full py-3 rounded-full bg-black text-white font-medium text-sm whitespace-nowrap transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url(/images/6707b45e1c28f88fc781209a_noise.webp)', backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
                <span className="relative z-10">Start Building <span aria-hidden style={{ marginLeft: 8 }}>→</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      {open && (
        <BrandingKitModal
          isOpen={open}
          problemText={problemText}
          solutionText={solutionText}
          defaultBusinessName={defaultBusinessName}
          onClose={() => setOpen(false)}
        />
      )}
      {openUIProto && (
        <PRDKitModal
          isOpen={openUIProto}
          problemText={problemText}
          solutionText={solutionText}
          technology={technology}
          onClose={() => setOpenUIProto(false)}
        />
      )}
      {openPitchMaster && (
        <PitchMasterKitModal
          isOpen={openPitchMaster}
          problemText={problemText}
          solutionText={solutionText}
          onClose={() => setOpenPitchMaster(false)}
        />
      )}
    </>
  );
}