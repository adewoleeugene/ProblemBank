'use client';

import React from 'react';

interface GitHubRepoCardProps {
  repoUrl: string;
  index: number;
}

// Featured card background/rotation utilities (same as TechStackCard)
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

const GitHubRepoCard: React.FC<GitHubRepoCardProps> = ({ repoUrl, index }) => {
  return (
    <div className="block">
      <div
        className="relative border border-[#e8ddd0] shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#d8cdbc] overflow-hidden rounded-[28px] md:rounded-[34px] lg:rounded-[38px] cursor-pointer"
        style={{
          backgroundColor: getBackgroundForGlobalIndex(index + 1),
          transform: `rotate(${getRotationAngleForGlobalIndex(index + 1)}deg)`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
        onClick={() => window.open(repoUrl, '_blank', 'noopener,noreferrer')}
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
                className="text-2xl mb-3 text-left"
                style={{ fontFamily: 'Decoy', fontWeight: 500, color: '#403f3e' }}
              >
                GitHub Repository
              </h3>
            </div>
            <div>
              <div>
                <p
                  className="text-sm leading-relaxed text-left"
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
                  Development resources and implementation code for this project. Access the complete codebase, documentation, and development setup.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GitHubRepoCard;
