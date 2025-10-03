'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ResourcesSubnav: React.FC = () => {
  const pathname = usePathname();

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
        <Link
          href="/resources/kits"
          className={`px-4 py-2 rounded-full transition-all duration-200 ${
            pathname === '/resources/kits' 
              ? 'font-semibold' 
              : 'hover:bg-[#f2e8dc]'
          }`}
          style={{
            color: pathname === '/resources/kits' ? '#403f3e' : '#666',
            backgroundColor: pathname === '/resources/kits' ? '#f2e8dc' : 'transparent',
          }}
        >
          Builder's Kits
        </Link>
        <span 
          className="mx-2 text-sm"
          style={{ color: '#d8cdbc' }}
        >
          |
        </span>
        <Link
          href="/resources/tech"
          className={`px-4 py-2 rounded-full transition-all duration-200 ${
            pathname === '/resources/tech' 
              ? 'font-semibold' 
              : 'hover:bg-[#f2e8dc]'
          }`}
          style={{
            color: pathname === '/resources/tech' ? '#403f3e' : '#666',
            backgroundColor: pathname === '/resources/tech' ? '#f2e8dc' : 'transparent',
          }}
        >
          Tech Stack
        </Link>
      </div>
    </div>
  );
};

export default ResourcesSubnav;
