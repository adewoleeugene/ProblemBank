export interface Kit {
  title: string;
  description: string;
  tags: string[];
  items: string[];
  moreLabel?: string;
}

export const kits: Kit[] = [
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
    title: 'UI Prototype Kit',
    description:
      "Build complete UI components and user flows for your prototype using AI-powered design and development tools. Focus on creating polished, interactive interfaces that demonstrate your product's core user experience.",
    tags: ['ui-design', 'prototyping', 'user-flows'],
    items: [
      'UI component library',
      'Interactive user flow',
      'Responsive design system',
    ],
    moreLabel: '+1 more',
  },
  {
    title: 'Pitch Master Kit',
    description: 'Create compelling pitch presentations optimized for Gamma AI presentation software.',
    tags: ['pitch', 'gamma', 'presentation'],
    items: [
      'Gamma-ready pitch deck prompts',
      'Executive summary template',
      'Demo script and Q&A guide',
    ],
    moreLabel: '+1 more',
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
  {
    title: 'Tech Stack Checklist',
    description:
      'Technical decisions and actions guide for building robust, low-bandwidth applications with AI and Blockchain considerations.',
    tags: ['development', 'ai', 'blockchain', 'launch'],
    items: [
      'Foundation & Planning phase',
      'Development & Integration',
      'Launch & Maintenance phase',
    ],
    moreLabel: '+15 more',
  },
  {
    title: 'Social Media Content Generator',
    description: 'Fill out the fields below to generate a tailored social media content calendar.',
    tags: ['social-media', 'content', 'marketing', 'calendar'],
    items: [
      'Project identity setup',
      'Content strategy planning',
      'Platform & duration selection',
    ],
    moreLabel: '+3 more',
  },
  {
    title: 'Research & Validation Kit 🔬',
    description: 'Guide you through testing your idea against the real world to ensure you are building something people actually want and need.',
    tags: ['research', 'validation', 'market-analysis', 'sierra-leone'],
    items: [
      'Idea & assumptions testing',
      'Market size validation',
      'Competitor analysis',
    ],
    moreLabel: '+1 more',
  },
];

// Helper to generate slugs for deep linking
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Get all unique tags across all kits
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  kits.forEach(kit => {
    kit.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Filter kits by tags (OR logic) and search query
export function filterKits(kits: Kit[], selectedTags: string[], searchQuery: string): Kit[] {
  return kits.filter(kit => {
    // Tag filter: if no tags selected, show all; otherwise match any selected tag
    const tagMatch = selectedTags.length === 0 || 
      selectedTags.some(tag => kit.tags.includes(tag));
    
    // Search filter: match title, description, tags, or items
    const searchMatch = !searchQuery || 
      [kit.title, kit.description, ...kit.tags, ...kit.items].some(field => 
        field.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return tagMatch && searchMatch;
  });
}

// Get suggestions for autocomplete (titles only)
export function getSuggestions(kits: Kit[], query: string, limit: number = 5): string[] {
  if (!query.trim()) return [];
  
  const suggestions = kits
    .filter(kit => kit.title.toLowerCase().includes(query.toLowerCase()))
    .map(kit => kit.title)
    .slice(0, limit);
    
  return suggestions;
}
