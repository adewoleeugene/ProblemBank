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
  'Human Capital Development': ['Cursor', 'Tempo', 'Lovable', 'v0', 'Vibecode', 'Google AI Studio', 'The Open Builder'], // Education/development
  'Youth Employment Scheme': ['Cursor', 'Bolt', 'Base44', 'Dreamflow', 'Vibecode', 'The Open Builder'], // Employment/opportunities
  'Public Service Architecture Revamp': ['Firebase Studio', 'Bubble', 'Google AI Studio'], // Government/infrastructure
  'Tech and Infrastructure': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio', 'The Open Builder'] // All tools relevant
};

// Keyword-to-tool mappings for problem/solution text matching
const KEYWORD_TOOL_MAPPINGS: Record<string, string[]> = {
  // Development keywords
  'development': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio', 'The Open Builder'],
  'build': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Vibecode', 'Google AI Studio', 'The Open Builder'],
  'code': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Vibecode', 'Google AI Studio', 'The Open Builder'],
  'app': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Bubble', 'Vibecode', 'The Open Builder'],
  'website': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode', 'The Open Builder'],
  'platform': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Firebase Studio', 'Bubble', 'Vibecode', 'Google AI Studio', 'The Open Builder'],
  
  // UI/UX keywords
  'interface': ['v0', 'Bubble', 'Dreamflow'],
  'design': ['v0', 'Bubble', 'Dreamflow'],
  'ui': ['v0', 'Bubble', 'Dreamflow'],
  'frontend': ['Cursor', 'v0', 'Tempo', 'Lovable', 'Bolt', 'Base44', 'Dreamflow'],
  
  // Backend/infrastructure keywords
  'backend': ['Cursor', 'Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  'database': ['Cursor', 'Firebase Studio', 'Tempo', 'Lovable'],
  'api': ['Cursor', 'Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  'server': ['Cursor', 'Firebase Studio', 'Tempo', 'Lovable', 'Bolt'],
  
  // Mobile keywords
  'mobile': ['Firebase Studio', 'Bubble', 'Vibecode'],
  'ios': ['Firebase Studio', 'Bubble', 'Vibecode'],
  'android': ['Firebase Studio', 'Bubble', 'Vibecode'],
  
  // No-code/low-code keywords
  'nocode': ['Bubble', 'Dreamflow'],
  'lowcode': ['Bubble', 'Dreamflow', 'Base44'],
  'visual': ['Bubble', 'Dreamflow', 'v0'],
  
  // Rapid prototyping keywords
  'prototype': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  'mvp': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  'quick': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'v0', 'Base44', 'Dreamflow', 'Bubble', 'Vibecode'],
  
  // AI/ML keywords
  'ai': ['Cursor', 'Google AI Studio', 'Tempo', 'Lovable', 'Bolt', 'Vibecode', 'The Open Builder'],
  'machine learning': ['Google AI Studio'],
  'google': ['Google AI Studio'],
  'integration': ['Google AI Studio', 'Firebase Studio', 'Tempo', 'Lovable'],

  // Code editor/IDE keywords
  'coding': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'Vibecode', 'The Open Builder'],
  'editor': ['Cursor'],
  'ide': ['Cursor'],
  'programming': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'Vibecode', 'Google AI Studio', 'The Open Builder'],
  'full-stack': ['Cursor', 'Tempo', 'Lovable', 'Bolt', 'Firebase Studio', 'The Open Builder'],

  // Open source keywords
  'open source': ['The Open Builder'],
  'deployment': ['The Open Builder', 'Firebase Studio']
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
 * ALWAYS prioritizes Cursor and v0 as the first two recommended tools
 */
export function getRecommendedTools(
  allTools: AITool[],
  context: MatchingContext
): ToolMatch[] {
  // Create matches for all tools
  const matches: ToolMatch[] = allTools.map(tool => {
    const score = scoreTool(tool, context);
    return {
      tool,
      score,
      isRecommended: score >= 2
    };
  });

  // Separate Cursor and v0 from other tools
  const priorityTools: ToolMatch[] = [];
  const otherTools: ToolMatch[] = [];

  matches.forEach(match => {
    if (match.tool.name === 'Cursor' || match.tool.name === 'v0') {
      // Give Cursor and v0 maximum priority scores
      match.score = match.score + 1000; // Ensure they're always highest
      match.isRecommended = true;
      priorityTools.push(match);
    } else {
      otherTools.push(match);
    }
  });

  // Sort priority tools: Cursor first, then v0
  priorityTools.sort((a, b) => {
    if (a.tool.name === 'Cursor') return -1;
    if (b.tool.name === 'Cursor') return 1;
    return 0;
  });

  // Sort other tools by score
  const sortedOtherTools = otherTools
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);

  // Return priority tools first, then other tools
  return [...priorityTools, ...sortedOtherTools];
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



