export interface AITool {
  name: string;
  description: string;
  url: string;
  categories?: string[];
  keywords?: string[];
}

export const aiTools: AITool[] = [
  {
    name: 'Tempo',
    description: 'AI-powered development environment for building full-stack applications with natural language',
    url: 'https://www.tempo.new/',
    categories: ['Human Capital Development', 'Tech and Infrastructure'],
    keywords: ['development', 'full-stack', 'natural language', 'ai', 'rapid prototyping', 'mvp']
  },
  {
    name: 'Lovable',
    description: 'AI coding platform that transforms ideas into functional code instantly',
    url: 'https://lovable.dev/',
    categories: ['Human Capital Development', 'Tech and Infrastructure'],
    keywords: ['ai coding', 'ideas to code', 'development', 'rapid prototyping', 'mvp', 'full-stack']
  },
  {
    name: 'Bolt',
    description: 'StackBlitz\'s AI tool for prompt-to-full-stack web app development',
    url: 'https://bolt.new/',
    categories: ['Youth Employment Scheme', 'Tech and Infrastructure'],
    keywords: ['prompt to app', 'web development', 'full-stack', 'rapid prototyping', 'mvp']
  },
  {
    name: 'v0',
    description: 'Vercel\'s generative UI tool that creates React components from text prompts',
    url: 'https://v0.app/',
    categories: ['Human Capital Development', 'Tech and Infrastructure'],
    keywords: ['ui', 'react', 'components', 'design', 'frontend', 'interface', 'visual']
  },
  {
    name: 'Base44',
    description: 'AI-powered web development platform for rapid prototyping',
    url: 'https://base44.com/',
    categories: ['Youth Employment Scheme', 'Tech and Infrastructure'],
    keywords: ['rapid prototyping', 'web development', 'mvp', 'lowcode', 'quick']
  },
  {
    name: 'Dreamflow',
    description: 'Visual AI development tool for building applications',
    url: 'https://dreamflow.app/',
    categories: ['Youth Employment Scheme', 'Tech and Infrastructure'],
    keywords: ['visual', 'development', 'applications', 'nocode', 'lowcode', 'interface', 'design']
  },
  {
    name: 'Firebase Studio',
    description: 'AI workspace for building backends, frontends, and mobile apps',
    url: 'https://firebase.studio/',
    categories: ['Feed Salone', 'Public Service Architecture Revamp', 'Tech and Infrastructure'],
    keywords: ['backend', 'frontend', 'mobile', 'database', 'api', 'server', 'ios', 'android', 'platform']
  },
  {
    name: 'Bubble',
    description: 'No-code platform with AI capabilities for building web applications',
    url: 'https://bubble.io/',
    categories: ['Feed Salone', 'Public Service Architecture Revamp'],
    keywords: ['nocode', 'web applications', 'platform', 'visual', 'lowcode', 'mobile', 'ios', 'android']
  },
  {
    name: 'Vibecode',
    description: 'AI-powered platform for building native apps in seconds with natural language descriptions',
    url: 'https://www.vibecodeapp.com/',
    categories: ['Human Capital Development', 'Youth Employment Scheme', 'Tech and Infrastructure'],
    keywords: ['native apps', 'mobile', 'ios', 'android', 'rapid prototyping', 'mvp', 'development', 'ai coding']
  },
  {
    name: 'Google AI Studio',
    description: 'Google\'s AI development platform for building and deploying AI applications',
    url: 'https://aistudio.google.com/',
    categories: ['Human Capital Development', 'Tech and Infrastructure', 'Public Service Architecture Revamp'],
    keywords: ['ai', 'machine learning', 'google', 'development', 'api', 'backend', 'platform', 'integration']
  }
];
