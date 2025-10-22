'use client';

import React from 'react';
import { aiTools } from '@/lib/aiTools';
import { getRecommendedTools, MatchingContext } from '@/lib/aiToolMatcher';
import AIToolCard from './AIToolCard';
import GitHubRepoCard from './GitHubRepoCard';

interface IdeaSidebarProps {
  category?: string;
  problemText?: string;
  solutionText?: string;
  repo?: string;
  ideaTitle: string;
}

export default function IdeaSidebar({ 
  category, 
  problemText, 
  solutionText, 
  repo 
}: IdeaSidebarProps) {
  const matchingContext: MatchingContext = {
    category,
    problemText,
    solutionText
  };

  // Get top 3 recommended tools
  const recommendedTools = getRecommendedTools(aiTools, matchingContext).slice(0, 3);

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Recommended AI Tools Section - Limited to 3 */}
      {recommendedTools.length > 0 && (
        <div>
          <h3 
            className="text-lg font-semibold mb-4 text-center lg:text-left"
            style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e' }}
          >
            Recommended AI Tools
          </h3>
          <div className="space-y-4">
            {recommendedTools.map((match, index) => (
              <AIToolCard
                key={match.tool.name}
                tool={match.tool}
                isRecommended={match.isRecommended}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* GitHub Repository Section */}
      {repo && (
        <div>
          <GitHubRepoCard
            repoUrl={repo}
            index={recommendedTools.length}
          />
        </div>
      )}
    </div>
  );
}
