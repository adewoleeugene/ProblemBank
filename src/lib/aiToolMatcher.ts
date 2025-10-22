import { AITool } from './aiTools';

export interface ToolMatch {
  tool: AITool;
  score: number;
  isRecommended: boolean;
}

export interface MatchingContext {
  category?: string;
  problemText?: string;
  solutionText?: string;
}

// Category-to-tool mappings based on the 5 main categories
const CATEGORY_TOOL_MAPPINGS: Record<string, string[]> = {
  'Feed Salone': ['Bubble', 'Firebase Studio'], // Agriculture/food systems
  'Human Capital Development': ['Tempo', 'Lovable', 'v0', 'Vibecode', 'Google AI Studio'], // Education/development
  'Youth Employment Scheme': ['Bolt', 'Base44', 'Dreamflow', 'Vibecode'], // Employment/opportunities
  'Public Service Architecture Revamp': ['Firebase Studio', 'Bubble', 'Google AI Studio'], // Government/infrastructure
  'Tech and Infrastructure': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio'] // All tools relevant
};

// Keyword-to-tool mappings for problem/solution text matching
const KEYWORD_TOOL_MAPPINGS: Record<string, string[]> = {
  // Development keywords
  'development': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio'],
  'build': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio'],
  'code': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Vibecode', 'Google AI Studio'],
  'app': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Bubble', 'Vibecode'],
  'website': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  'platform': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Bubble', 'Vibecode', 'Google AI Studio'],
  
  // UI/UX keywords
  'interface': ['v0', 'Bubble', 'Dreamflow'],
  'design': ['v0', 'Bubble', 'Dreamflow'],
  'ui': ['v0', 'Bubble', 'Dreamflow'],
  'frontend': ['v0', 'Tempo', 'Lovable', 'Bolt', 'Base44', 'Dreamflow'],
  
  // Backend/infrastructure keywords
  'backend': ['Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  'database': ['Firebase Studio', 'Tempo', 'Lovable'],
  'api': ['Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  'server': ['Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  
  // Mobile keywords
  'mobile': ['Firebase Studio', 'Bubble', 'Vibecode'],
  'ios': ['Firebase Studio', 'Bubble', 'Vibecode'],
  'android': ['Firebase Studio', 'Bubble', 'Vibecode'],
  
  // No-code/low-code keywords
  'nocode': ['Bubble', 'Dreamflow'],
  'lowcode': ['Bubble', 'Dreamflow', 'Base44'],
  'visual': ['Bubble', 'Dreamflow', 'v0'],
  
  // Rapid prototyping keywords
  'prototype': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  'mvp': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  'quick': ['Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  
  // AI/ML keywords
  'ai': ['Google AI Studio', 'Tempo', 'Lovable', 'Bolt', 'Vibecode'],
  'machine learning': ['Google AI Studio'],
  'google': ['Google AI Studio'],
  'integration': ['Google AI Studio', 'Firebase Studio', 'Tempo', 'Lovable']
};

/**
 * Score an AI tool based on the matching context
 */
function scoreTool(tool: AITool, context: MatchingContext): number {
  let score = 0;
  
  // Category matching (highest priority)
  if (context.category && tool.categories?.includes(context.category)) {
    score += 3;
  }
  
  // Keyword matching in problem text (high priority)
  if (context.problemText) {
    const problemLower = context.problemText.toLowerCase();
    for (const keyword in KEYWORD_TOOL_MAPPINGS) {
      if (problemLower.includes(keyword) && KEYWORD_TOOL_MAPPINGS[keyword].includes(tool.name)) {
        score += 2;
      }
    }
  }
  
  // Keyword matching in solution text (medium priority)
  if (context.solutionText) {
    const solutionLower = context.solutionText.toLowerCase();
    for (const keyword in KEYWORD_TOOL_MAPPINGS) {
      if (solutionLower.includes(keyword) && KEYWORD_TOOL_MAPPINGS[keyword].includes(tool.name)) {
        score += 1;
      }
    }
  }
  
  return score;
}

/**
 * Get recommended AI tools for a given context
 */
export function getRecommendedTools(
  allTools: AITool[], 
  context: MatchingContext
): ToolMatch[] {
  const matches: ToolMatch[] = allTools.map(tool => {
    const score = scoreTool(tool, context);
    return {
      tool,
      score,
      isRecommended: score >= 2
    };
  });
  
  // Filter out tools with score 0 and sort by score (highest first)
  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Get all tools with recommendations highlighted
 */
export function getAllToolsWithRecommendations(
  allTools: AITool[], 
  context: MatchingContext
): ToolMatch[] {
  const matches: ToolMatch[] = allTools.map(tool => {
    const score = scoreTool(tool, context);
    return {
      tool,
      score,
      isRecommended: score >= 2
    };
  });
  
  // Sort by recommendation status first, then by score
  return matches.sort((a, b) => {
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    return b.score - a.score;
  });
}



