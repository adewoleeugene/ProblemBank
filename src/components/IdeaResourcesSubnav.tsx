'use client';

import React from 'react';

interface IdeaResourcesSubnavProps {
  activeTab: 'builders-kits' | 'tech-stack';
  onTabChange: (tab: 'builders-kits' | 'tech-stack') => void;
}

const IdeaResourcesSubnav: React.FC<IdeaResourcesSubnavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex justify-center mb-8">
      <div 
        className="inline-flex items-center rounded-full border px-6 py-3"
        style={{ 
          backgroundColor: '#fffaf3', 
          borderColor: '#e8ddd0',
          fontFamily: 'Raleway, sans-serif'
        }}
      >
        <button
          onClick={() => onTabChange('builders-kits')}
          className={`px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'builders-kits' 
              ? 'font-semibold' 
              : 'hover:bg-[#f2e8dc]'
          }`}
          style={{
            color: activeTab === 'builders-kits' ? '#403f3e' : '#666',
            backgroundColor: activeTab === 'builders-kits' ? '#f2e8dc' : 'transparent',
          }}
        >
          Builder&apos;s Kits
        </button>
        <span 
          className="mx-2 text-sm"
          style={{ color: '#d8cdbc' }}
        >
          |
        </span>
        <button
          onClick={() => onTabChange('tech-stack')}
          className={`px-4 py-2 rounded-full transition-all duration-200 ${
            activeTab === 'tech-stack' 
              ? 'font-semibold' 
              : 'hover:bg-[#f2e8dc]'
          }`}
          style={{
            color: activeTab === 'tech-stack' ? '#403f3e' : '#666',
            backgroundColor: activeTab === 'tech-stack' ? '#f2e8dc' : 'transparent',
          }}
        >
          Tech Stack
        </button>
      </div>
    </div>
  );
};

export default IdeaResourcesSubnav;
