'use client';

import React, { useState } from 'react';
import IdeaResourcesSubnav from './IdeaResourcesSubnav';
import BuildersKitsClient from './BuildersKitsClient';
import TechStackSection from './TechStackSection';

interface IdeaResourcesClientProps {
  problemText: string;
  solutionText: string;
  defaultBusinessName: string;
  category: string | null;
}

export default function IdeaResourcesClient({ 
  problemText, 
  solutionText, 
  defaultBusinessName, 
  category 
}: IdeaResourcesClientProps) {
  const [activeTab, setActiveTab] = useState<'builders-kits' | 'tech-stack'>('builders-kits');

  return (
    <section className="relative z-30 w-full -mt-30">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 md:py-14 lg:py-16">
        {/* Navigation */}
        <IdeaResourcesSubnav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Content */}
        {activeTab === 'builders-kits' && (
          <BuildersKitsClient
            problemText={problemText}
            solutionText={solutionText}
            defaultBusinessName={defaultBusinessName}
            category={category}
          />
        )}
        
        {activeTab === 'tech-stack' && (
          <TechStackSection />
        )}
      </div>
    </section>
  );
}
