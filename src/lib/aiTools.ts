export interface AITool {
  name: string;
  description: string;
  url: string;
}

export const aiTools: AITool[] = [
  {
    name: 'Tempo',
    description: 'AI-powered development environment for building full-stack applications with natural language',
    url: 'https://www.tempo.new/'
  },
  {
    name: 'Lovable',
    description: 'AI coding platform that transforms ideas into functional code instantly',
    url: 'https://lovable.dev/'
  },
  {
    name: 'Bolt',
    description: 'StackBlitz\'s AI tool for prompt-to-full-stack web app development',
    url: 'https://bolt.new/'
  },
  {
    name: 'v0',
    description: 'Vercel\'s generative UI tool that creates React components from text prompts',
    url: 'https://v0.app/'
  },
  {
    name: 'Base44',
    description: 'AI-powered web development platform for rapid prototyping',
    url: 'https://base44.com/'
  },
  {
    name: 'Dreamflow',
    description: 'Visual AI development tool for building applications',
    url: 'https://dreamflow.app/'
  },
  {
    name: 'Firebase Studio',
    description: 'AI workspace for building backends, frontends, and mobile apps',
    url: 'https://firebase.studio/'
  },
  {
    name: 'Bubble',
    description: 'No-code platform with AI capabilities for building web applications',
    url: 'https://bubble.io/'
  }
];
