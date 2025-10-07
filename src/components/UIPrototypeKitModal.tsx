'use client';

import React, { useMemo, useState } from 'react';

interface UIPrototypeKitModalProps {
  onClose: () => void;
  problemText?: string;
  solutionText?: string;
}

type TargetPlatforms = {
  mobile: boolean;
  web: boolean;
  tablet: boolean;
  responsive: boolean;
};

type BlueprintInputs = {
  projectType: string;
  userPersona: string;
  problemStatement: string;
  keyFeatures: string; // comma or newline separated
  coreUserTask: string;
  platforms: TargetPlatforms;
};

type DesignInputs = {
  brandPersonality: string; // comma-separated adjectives
  techStack?: string; // optional for components generation
};

type DesignStyle = {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  typography: string;
  inspirationText: string;
};

const DESIGN_STYLES: DesignStyle[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean whitespace, Simple sans-serif typography',
    characteristics: ['Generous whitespace', 'Limited color palette', 'Simple geometric shapes', 'Sans-serif fonts', 'Subtle animations'],
    colors: { primary: '#5B9DD4', secondary: '#FFFFFF', accent: '#4A8BC2', background: 'linear-gradient(135deg, #5B9DD4 0%, #6BAED6 100%)' },
    typography: 'System fonts (SF Pro, Roboto, Inter), Light to Regular weights',
    inspirationText: 'Minimalist design following principles of reduction and simplicity. Inspired by Apple\'s design language, Muji aesthetics, and Swiss minimalism. Focus on essential elements only, with generous whitespace and restrained use of color. Typography should be clean and highly legible.'
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    description: 'Aggressive colors, Ultra-bold typography',
    characteristics: ['Ultra-thick borders (6-8px)', 'ALL CAPS typography', 'Clashing bright colors', 'Harsh shadows', 'Unapologetic brutality'],
    colors: { primary: '#00AA13', secondary: '#EC008C', accent: '#FFD600', background: '#ffffff' },
    typography: 'Ultra-bold display fonts (Bebas Neue, Archivo Black), 800-900 weight',
    inspirationText: 'Aggressive brutalist design inspired by Gojek app and modern digital brutalism. Features ultra-thick borders (6-8px), clashing bright colors (neon green #00AA13, hot pink #EC008C, electric yellow), ALL CAPS typography, and uncompromising boldness. Zero subtlety, maximum impact.'
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    description: 'Frosted glass cards, Backdrop blur effects',
    characteristics: ['Backdrop blur', 'Transparency', 'Subtle borders', 'Floating elements', 'Light shadows'],
    colors: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.1)', accent: '#6366f1', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    typography: 'Modern sans-serif (Inter, SF Pro), Medium weight',
    inspirationText: 'Glassmorphism design inspired by Apple\'s Big Sur, iOS design language, and Windows Fluent Design. Features frosted glass effect with backdrop-filter blur, subtle transparency, and layered depth. Elements appear to float with soft shadows and light borders.'
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Dark mode soft shadows, Embossed depth',
    characteristics: ['Dual soft shadows', 'Dark charcoal background', 'Cyan accents', 'Embossed/inset elements', 'Low contrast subtlety'],
    colors: { primary: '#2d3436', secondary: '#3e444a', accent: '#3DCFD3', background: '#2d3436' },
    typography: 'Rounded sans-serif (Poppins, Nunito, Rubik), Medium weight',
    inspirationText: 'Dark mode neumorphism with charcoal background (#2d3436) and cyan accents (#3DCFD3). Features dual soft shadows (light: #3e444a, dark: #1a1d1f) creating subtle embossed and inset effects. Extremely low contrast for sophisticated, tactile UI elements.'
  },
  {
    id: 'claymorphism',
    name: 'Claymorphism',
    description: '3D rounded elements, Bright saturated colors',
    characteristics: ['Thick borders', 'Bright gradient backgrounds', 'Soft shadows', 'Ultra-rounded corners', 'Playful 3D clay feel'],
    colors: { primary: '#7B68EE', secondary: '#FF9A8D', accent: '#00D9A7', background: 'linear-gradient(135deg, #7B68EE 0%, #9B8FD9 100%)' },
    typography: 'Rounded sans-serif (Quicksand, Nunito, Comfortaa), Bold weight',
    inspirationText: 'Claymorphism with vibrant purple gradient background and playful fintech aesthetic. Features white elevated cards with soft shadows, colorful rounded icons (coral, green, pink), thick rounded borders (24-32px radius), and 3D clay-like depth through subtle inner shadows.'
  },
  {
    id: 'skeuomorphism',
    name: 'Skeuomorphism',
    description: 'Realistic textures, Button depth',
    characteristics: ['Realistic depth/shadows', 'Embossed elements', 'Soft gradients', 'Layered elevation', 'Tactile 3D feel'],
    colors: { primary: '#FF9A5A', secondary: '#F5F7FA', accent: '#8BC34A', background: '#E8EDF2' },
    typography: 'Clean sans-serif (SF Pro, Roboto), Medium to Bold weight',
    inspirationText: 'Skeuomorphic design with realistic depth and shadows. Features multiple layered shadows creating 3D effect, embossed circular elements, soft gradient backgrounds mimicking real materials, inner shadows and highlights making cards appear pressed into surface, and beveled edges with smooth tactile transitions.'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk/Futuristic',
    description: 'Neon accent colors, Dark backgrounds',
    characteristics: ['Neon glows', 'Dark backgrounds', 'High contrast cards', 'Glowing borders', 'Futuristic fonts'],
    colors: { primary: '#00ff9f', secondary: '#00d9ff', accent: '#ff0080', background: '#0a0e27' },
    typography: 'Futuristic/Tech fonts (Orbitron, Rajdhani, Audiowide), Bold weight',
    inspirationText: 'Cyberpunk/futuristic design with better contrasted cards on very dark backgrounds. Features bright neon glowing borders (cyan #00d9ff, magenta #ff0080), lighter card backgrounds (#1a1f3a) for visibility, strong glow effects, grid patterns, and high-contrast neon text for maximum readability.'
  },
  {
    id: 'material',
    name: 'Material Design',
    description: 'Layered cards, Elevation shadows',
    characteristics: ['Bold primary colors', 'Elevation shadows', 'Rounded buttons', 'Z-axis depth', 'Clear hierarchy'],
    colors: { primary: '#1976D2', secondary: '#FF8A80', accent: '#90CAF9', background: '#0D6EFD' },
    typography: 'Roboto, Medium to Bold weight',
    inspirationText: 'Material Design with vibrant blue backgrounds and elevation shadows. Features layered cards with distinct depth, rounded buttons with shadows, floating action buttons, organic blob shapes, high contrast text on colored backgrounds, and clear z-axis depth hierarchy through multiple shadow levels.'
  },
  {
    id: 'flat',
    name: 'Flat Design',
    description: 'Zero shadows, Solid color blocks',
    characteristics: ['Absolutely no shadows', 'Solid color blocks', 'Bold simple shapes', 'High contrast', 'Clean grid layout'],
    colors: { primary: '#000000', secondary: '#FF8A80', accent: '#4CAF50', background: '#FAFAFA' },
    typography: 'Sans-serif (Roboto, Open Sans, Lato), Bold weight',
    inspirationText: 'Flat design with completely two-dimensional aesthetic. Features zero shadows, solid color blocks (light blue, pink, peach), bold simple shapes (circles, rounded rectangles), high contrast black-on-white, simple minimalist icons, no gradients, clean sans-serif typography, and strict grid-based layouts.'
  },
  {
    id: 'retro',
    name: 'Retro/Vintage',
    description: 'Nostalgic aesthetics, Period-specific typography',
    characteristics: ['Warm aged paper tones', 'Muted desaturated colors', 'Simple line borders', 'Classic typography', 'Nostalgic icons'],
    colors: { primary: '#2C2420', secondary: '#FF9A8B', accent: '#D47B6A', background: '#F0E4D0' },
    typography: 'Classic serif or retro sans-serif (Playfair Display, Courier), varied weights',
    inspirationText: 'Retro/vintage design with warm beige/cream aged paper aesthetic. Features muted coral and brown tones, classic typography, simple thin black line borders, nostalgic camera icons with retro styling, minimal shadows, clean structured grid layouts, and dotted/dashed lines as classic design elements.'
  },
  {
    id: 'swiss',
    name: 'Swiss Style',
    description: 'Sans-serif typography, Grid-based layouts',
    characteristics: ['Mathematical grid precision', 'Helvetica typography', 'Asymmetric balance', 'Limited neutral palette', 'Objective photography', 'Clean whitespace'],
    colors: { primary: '#000000', secondary: '#8B6F47', accent: '#E8E6E0', background: '#F5F5F0' },
    typography: 'Helvetica, Univers, Akzidenz-Grotesk - clean sans-serif',
    inspirationText: 'Swiss Style (International Typographic Style) with neutral cream background (#F5F5F0), pure black typography, and warm wood accents (#8B6F47). Features mathematical grid precision, asymmetric but balanced layouts, generous whitespace, objective photography, clean sans-serif fonts (Helvetica), and functional minimalism inspired by mid-century Swiss graphic design.'
  },
  {
    id: 'memphis',
    name: 'Memphis Design',
    description: 'Bold clashing colors, Geometric shapes',
    characteristics: ['Bold clashing colors', 'Thick black borders (3-4px)', 'Geometric shapes at angles', 'Playful chaotic layout', 'High contrast', 'Rotated elements'],
    colors: { primary: '#FF1493', secondary: '#00D4FF', accent: '#FFD700', background: 'linear-gradient(135deg, #FFE5F1 0%, #FFF9E5 50%, #E5F9FF 100%)' },
    typography: 'Bold geometric fonts (Archivo Black, Bebas Neue), heavy weights',
    inspirationText: 'Memphis Design inspired by 1980s Italian design movement. Features bold clashing colors (hot pink #FF1493, cyan #00D4FF, yellow #FFD700, purple), thick black borders (3-4px), geometric shapes at various angles, playful chaotic asymmetric composition, high contrast, and postmodern maximalism with colorful patterns.'
  },
  {
    id: 'grunge',
    name: 'Grunge Design',
    description: 'Distressed textures, Handwritten fonts',
    characteristics: ['Heavy texture/grain overlay', 'Distressed aged appearance', 'Dark moody backgrounds', 'Muted desaturated colors', 'Rough edges', 'Urban decay aesthetic'],
    colors: { primary: '#C4A882', secondary: '#B8956A', accent: '#8B7355', background: '#0d0d0d' },
    typography: 'Typewriter/distressed fonts (Courier, Special Elite, American Typewriter)',
    inspirationText: 'Grunge design with raw, heavily textured aesthetic. Features very dark charcoal backgrounds (#0d0d0d, #1a1a1a) with visible noise/grain texture, tan/beige distressed typography (#C4A882), muted desaturated colors, rough weathered edges, typewriter or handwritten fonts, and urban decay aesthetic inspired by 90s punk and industrial design.'
  },
  {
    id: 'geometric',
    name: 'Abstract/Geometric',
    description: 'Geometric shapes, Dynamic lines',
    characteristics: ['Bold geometric shapes', 'Vibrant gradients', 'Dynamic diagonal lines', 'Layered compositions', 'Wave patterns', 'Modern energetic feel'],
    colors: { primary: '#FF006E', secondary: '#FF6B35', accent: '#8338EC', background: 'linear-gradient(135deg, #F0F0F0 0%, #FFFFFF 100%)' },
    typography: 'Modern geometric fonts (Montserrat, Poppins, Inter), Bold weight',
    inspirationText: 'Abstract/geometric design with vibrant gradients (hot pink #FF006E to purple #8338EC), bold geometric shapes (circles, triangles, diagonal lines, wave patterns), dynamic layered compositions, coral/orange accents (#FF6B35), clean modern typography, and energetic contemporary aesthetic. Features overlapping elements and gradient overlays for depth.'
  }
];

function normalizeList(value: string): string[] {
  return value
    .split(/\n|,/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function platformsToList(p: TargetPlatforms): string[] {
  const out: string[] = [];
  if (p.mobile) out.push('Mobile App (iOS/Android)');
  if (p.web) out.push('Web App (Desktop)');
  if (p.tablet) out.push('Tablet');
  if (p.responsive) out.push('Responsive Website');
  return out;
}

function buildSectionPrompts(problemText: string | undefined, solutionText: string | undefined, blueprint: BlueprintInputs, design: DesignInputs, selectedStyleId: string) {
  const features = normalizeList(blueprint.keyFeatures);
  const personality = normalizeList(design.brandPersonality);
  const platforms = platformsToList(blueprint.platforms);
  
  const selectedStyle = DESIGN_STYLES.find(s => s.id === selectedStyleId);
  const designStyle = selectedStyle ? {
    name: selectedStyle.name,
    characteristics: selectedStyle.characteristics,
    inspiration: selectedStyle.inspirationText,
  } : undefined;

  const ctx = {
    problem: problemText || '',
    proposed_solution: solutionText || '',
    project_type: blueprint.projectType,
    user_persona: blueprint.userPersona,
    problem_statement: blueprint.problemStatement,
    key_features: features,
    core_user_task: blueprint.coreUserTask,
    target_platforms: platforms,
    brand_personality: personality,
    design_style: designStyle?.name,
    design_characteristics: designStyle?.characteristics,
    design_inspiration: designStyle?.inspiration,
    tech_stack: design.techStack || undefined,
  };

  const userFlowPrompt = [
    'Task: Create a comprehensive user journey (steps and decision points) for the prototype.',
    'Use the Entry Point and End Goal provided by the user.',
    'Ensure the journey is aligned to persona, core task, and key features.',
    '',
    `Context: ${JSON.stringify(ctx)}`,
    '',
    'Output: Plain text steps/bullets. Keep concise and actionable.'
  ].join('\n');

  const uiComponentsPrompt = [
    'Task: Propose a design system summary and a list of production-ready UI components/screens for the prototype.',
    'If tech stack is provided, tailor output (naming/props) to the stack.',
    '',
    `Context: ${JSON.stringify(ctx)}`,
    '',
    'Output: Plain text. Include component names, brief purpose, and key states.'
  ].join('\n');

  const implementationPrompt = [
    'Task: From the generated user flow and screen list, outline prompts/instructions to build an interactive prototype end-to-end.',
    'Identify data needed, navigation, and success criteria for each step.',
    '',
    `Context: ${JSON.stringify(ctx)}`,
    '',
    'Output: Plain text, grouped by screen/step.'
  ].join('\n');

  const testingPrompt = [
    'Task: Define a usability testing protocol and success metrics for the prototype.',
    'Include tasks, metrics (e.g., task completion rate, time on task), and a brief analysis plan.',
    '',
    `Context: ${JSON.stringify(ctx)}`,
    '',
    'Output: Plain text checklist and metric definitions.'
  ].join('\n');

  return { userFlowPrompt, uiComponentsPrompt, implementationPrompt, testingPrompt };
}

// Style Preview Component
const StylePreview: React.FC<{ style: DesignStyle }> = ({ style }) => {
  const textColor = style.id === 'minimalist' ? '#2C3E50' :
                   style.id === 'neumorphism' ? '#ffffff' :
                   style.id === 'cyberpunk' || style.id === 'grunge' ? '#fff' : 
                   style.id === 'brutalist' || style.id === 'swiss' ? '#000' :
                   style.id === 'material' ? '#212121' :
                   style.id === 'claymorphism' ? '#1A1A1A' :
                   style.id === 'flat' ? '#000' :
                   style.id === 'retro' ? style.colors.primary :
                   style.id === 'memphis' ? '#000' :
                   style.id === 'geometric' ? '#1A1A1A' :
                   style.colors.primary;
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2" style={{ color: textColor }}>
          {style.name} Design
        </h2>
        <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>
          Experience the aesthetic
        </p>
      </div>
      
      {/* Component Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card Example */}
        <div className="p-4 rounded-xl" style={{
          backgroundColor: style.id === 'minimalist' ? 'rgba(255,255,255,0.95)' :
                         style.id === 'brutalist' ? '#fff' :
                         style.id === 'glassmorphism' ? 'rgba(255,255,255,0.1)' :
                         style.id === 'neumorphism' ? style.colors.secondary :
                         style.id === 'claymorphism' ? '#fff' :
                         style.id === 'skeuomorphism' ? '#fff' :
                         style.id === 'cyberpunk' ? '#1a1f3a' :
                         style.id === 'material' ? '#fff' :
                         style.id === 'flat' ? '#E3F2FD' :
                         style.id === 'retro' ? '#fff' :
                         style.id === 'swiss' ? '#fff' :
                         style.id === 'memphis' ? '#fff' :
                         style.id === 'grunge' ? 'rgba(196,168,130,0.1)' :
                         style.id === 'geometric' ? '#fff' : '#fff',
          border: style.id === 'minimalist' ? 'none' :
                 style.id === 'brutalist' ? `6px solid ${style.colors.primary}` :
                 style.id === 'glassmorphism' ? '1px solid rgba(255,255,255,0.2)' :
                 style.id === 'neumorphism' ? 'none' :
                 style.id === 'claymorphism' ? 'none' :
                 style.id === 'skeuomorphism' ? '1px solid rgba(0,0,0,0.08)' :
                 style.id === 'cyberpunk' ? `2px solid ${style.colors.secondary}` :
                 style.id === 'material' ? 'none' :
                 style.id === 'flat' ? 'none' :
                 style.id === 'retro' ? `2px solid ${style.colors.primary}` :
                 style.id === 'swiss' ? '1px solid rgba(0,0,0,0.08)' :
                 style.id === 'memphis' ? '4px solid #000' :
                 style.id === 'grunge' ? `2px solid ${style.colors.secondary}` :
                 style.id === 'geometric' ? 'none' : '1px solid rgba(0,0,0,0.1)',
          backdropFilter: style.id === 'glassmorphism' ? 'blur(10px)' : 'none',
          boxShadow: style.id === 'minimalist' ? '0 8px 24px rgba(0,0,0,0.12)' :
                    style.id === 'neumorphism' ? '8px 8px 16px #1a1d1f, -8px -8px 16px #3e444a' :
                    style.id === 'brutalist' ? `8px 8px 0px ${style.colors.secondary}` :
                    style.id === 'claymorphism' ? '0 8px 24px rgba(123,104,238,0.2)' :
                    style.id === 'skeuomorphism' ? '0 8px 16px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.5)' :
                    style.id === 'cyberpunk' ? `0 0 20px ${style.colors.secondary}80` :
                    style.id === 'material' ? '0 4px 12px rgba(0,0,0,0.15)' :
                    style.id === 'flat' ? 'none' :
                    style.id === 'retro' ? 'none' :
                    style.id === 'swiss' ? '0 2px 8px rgba(0,0,0,0.06)' :
                    style.id === 'memphis' ? 'none' :
                    style.id === 'grunge' ? 'none' :
                    style.id === 'geometric' ? '0 8px 24px rgba(255,0,110,0.15)' : 'none',
          transform: style.id === 'memphis' ? 'rotate(-2deg)' : 'none',
          borderRadius: style.id === 'claymorphism' ? '24px' : 
                       style.id === 'material' ? '16px' : 
                       style.id === 'geometric' ? '20px' : '12px',
        }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: textColor }}>Card Title</h3>
          <p className="text-sm mb-3" style={{ color: textColor, opacity: 0.7 }}>
            This card demonstrates the {style.name.toLowerCase()} aesthetic with authentic styling.
          </p>
          <button className="px-4 py-2 rounded text-sm font-medium" style={{
            backgroundColor: style.id === 'minimalist' ? style.colors.accent :
                           style.id === 'brutalist' ? style.colors.secondary :
                           style.id === 'glassmorphism' ? 'rgba(255,255,255,0.2)' :
                           style.id === 'neumorphism' ? style.colors.accent :
                           style.id === 'claymorphism' ? style.colors.accent :
                           style.id === 'skeuomorphism' ? style.colors.primary :
                           style.id === 'cyberpunk' ? style.colors.primary :
                           style.id === 'material' ? style.colors.secondary :
                           style.id === 'flat' ? style.colors.accent :
                           style.id === 'retro' ? style.colors.secondary :
                           style.id === 'swiss' ? '#000' :
                           style.id === 'memphis' ? style.colors.primary :
                           style.id === 'grunge' ? style.colors.secondary :
                           style.id === 'geometric' ? `linear-gradient(135deg, ${style.colors.primary} 0%, ${style.colors.accent} 100%)` : style.colors.accent,
            color: '#fff',
            border: style.id === 'minimalist' ? 'none' :
                   style.id === 'brutalist' ? `6px solid ${style.colors.primary}` :
                   style.id === 'neumorphism' ? 'none' :
                   style.id === 'claymorphism' ? 'none' :
                   style.id === 'skeuomorphism' ? '1px solid rgba(0,0,0,0.1)' :
                   style.id === 'cyberpunk' ? `2px solid ${style.colors.primary}` :
                   style.id === 'material' ? 'none' :
                   style.id === 'flat' ? 'none' :
                   style.id === 'retro' ? `2px solid ${style.colors.primary}` :
                   style.id === 'swiss' ? 'none' :
                   style.id === 'memphis' ? '4px solid #000' :
                   style.id === 'grunge' ? `2px solid ${style.colors.primary}` :
                   style.id === 'geometric' ? 'none' : 'none',
            boxShadow: style.id === 'minimalist' ? '0 4px 12px rgba(0,0,0,0.1)' :
                      style.id === 'neumorphism' ? '4px 4px 8px #1a1d1f, -4px -4px 8px #3e444a' :
                      style.id === 'brutalist' ? `4px 4px 0px ${style.colors.accent}` :
                      style.id === 'claymorphism' ? '0 4px 12px rgba(0,209,167,0.3)' :
                      style.id === 'skeuomorphism' ? '0 4px 8px rgba(0,0,0,0.2), inset 0 -2px 4px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)' :
                      style.id === 'cyberpunk' ? `0 0 15px ${style.colors.primary}` :
                      style.id === 'material' ? '0 4px 8px rgba(0,0,0,0.2)' :
                      style.id === 'flat' ? 'none' :
                      style.id === 'retro' ? 'none' :
                      style.id === 'swiss' ? '0 1px 4px rgba(0,0,0,0.1)' :
                      style.id === 'memphis' ? 'none' :
                      style.id === 'grunge' ? 'none' :
                      style.id === 'geometric' ? '0 4px 16px rgba(255,0,110,0.3)' : 'none',
            backdropFilter: style.id === 'glassmorphism' ? 'blur(10px)' : 'none',
            textTransform: style.id === 'brutalist' || style.id === 'memphis' ? 'uppercase' as const : 'none' as const,
            fontWeight: style.id === 'brutalist' ? 900 : style.id === 'memphis' ? 800 : 500,
            borderRadius: style.id === 'claymorphism' ? '20px' : 
                         style.id === 'material' ? '24px' : 
                         style.id === 'geometric' ? '16px' : '8px',
            background: style.id === 'geometric' ? `linear-gradient(135deg, ${style.colors.primary} 0%, ${style.colors.accent} 100%)` : undefined,
          }}>
            {style.id === 'brutalist' || style.id === 'memphis' ? 'RADICAL!' : 'Click Me'}
          </button>
        </div>

        {/* Input Example */}
        <div className="p-4 rounded-xl" style={{
          backgroundColor: style.id === 'minimalist' ? 'rgba(255,255,255,0.95)' :
                         style.id === 'brutalist' ? '#fff' :
                         style.id === 'glassmorphism' ? 'rgba(255,255,255,0.1)' :
                         style.id === 'neumorphism' ? style.colors.secondary :
                         style.id === 'claymorphism' ? '#fff' :
                         style.id === 'skeuomorphism' ? '#fff' :
                         style.id === 'cyberpunk' ? '#1a1f3a' :
                         style.id === 'material' ? '#fff' :
                         style.id === 'flat' ? '#FFEBEE' :
                         style.id === 'retro' ? '#fff' :
                         style.id === 'swiss' ? '#fff' :
                         style.id === 'memphis' ? style.colors.accent :
                         style.id === 'grunge' ? 'rgba(196,168,130,0.1)' :
                         style.id === 'geometric' ? '#fff' : '#fff',
          border: style.id === 'minimalist' ? 'none' :
                 style.id === 'brutalist' ? `6px solid ${style.colors.accent}` :
                 style.id === 'glassmorphism' ? '1px solid rgba(255,255,255,0.2)' :
                 style.id === 'neumorphism' ? 'none' :
                 style.id === 'claymorphism' ? 'none' :
                 style.id === 'skeuomorphism' ? '1px solid rgba(0,0,0,0.08)' :
                 style.id === 'cyberpunk' ? `2px solid ${style.colors.accent}` :
                 style.id === 'material' ? 'none' :
                 style.id === 'flat' ? 'none' :
                 style.id === 'retro' ? `2px solid ${style.colors.primary}` :
                 style.id === 'swiss' ? '1px solid rgba(0,0,0,0.08)' :
                 style.id === 'memphis' ? '4px solid #000' :
                 style.id === 'grunge' ? `2px solid ${style.colors.primary}` :
                 style.id === 'geometric' ? 'none' : '1px solid rgba(0,0,0,0.1)',
          backdropFilter: style.id === 'glassmorphism' ? 'blur(10px)' : 'none',
          boxShadow: style.id === 'minimalist' ? '0 8px 24px rgba(0,0,0,0.12)' :
                    style.id === 'neumorphism' ? '8px 8px 16px #1a1d1f, -8px -8px 16px #3e444a' :
                    style.id === 'brutalist' ? `8px 8px 0px ${style.colors.primary}` :
                    style.id === 'claymorphism' ? '0 8px 24px rgba(123,104,238,0.2)' :
                    style.id === 'skeuomorphism' ? '0 8px 16px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.5)' :
                    style.id === 'cyberpunk' ? `0 0 20px ${style.colors.accent}80` :
                    style.id === 'material' ? '0 4px 12px rgba(0,0,0,0.15)' :
                    style.id === 'flat' ? 'none' :
                    style.id === 'retro' ? 'none' :
                    style.id === 'swiss' ? '0 2px 8px rgba(0,0,0,0.06)' :
                    style.id === 'memphis' ? 'none' :
                    style.id === 'grunge' ? 'none' :
                    style.id === 'geometric' ? '0 8px 24px rgba(131,56,236,0.15)' : 'none',
          borderRadius: style.id === 'claymorphism' ? '24px' : 
                       style.id === 'material' ? '16px' : 
                       style.id === 'memphis' ? '8px' :
                       style.id === 'geometric' ? '20px' : '12px',
          transform: style.id === 'memphis' ? 'rotate(1.5deg)' : 'none',
        }}>
          <label className="text-sm font-medium block mb-2" style={{ color: textColor }}>
            Input Field
          </label>
          <input
            type="text"
            placeholder="Enter text..."
            className="w-full px-3 py-2 rounded text-sm"
            style={{
              backgroundColor: style.id === 'neumorphism' ? style.colors.secondary :
                             style.id === 'glassmorphism' ? 'rgba(255,255,255,0.1)' :
                             style.id === 'claymorphism' ? '#F8F9FF' :
                             style.id === 'skeuomorphism' ? '#FAFAFA' :
                             style.id === 'cyberpunk' ? '#0a0e27' :
                             style.id === 'material' ? '#F5F5F5' :
                             style.id === 'flat' ? '#fff' :
                             style.id === 'retro' ? '#FFFAF5' :
                             style.id === 'swiss' ? '#fff' :
                             style.id === 'memphis' ? '#fff' :
                             style.id === 'grunge' ? 'rgba(196,168,130,0.05)' :
                             style.id === 'geometric' ? '#F8F8F8' : '#fff',
              border: style.id === 'minimalist' ? 'none' :
                     style.id === 'brutalist' ? `4px solid ${style.colors.secondary}` :
                     style.id === 'neumorphism' ? 'none' :
                     style.id === 'claymorphism' ? 'none' :
                     style.id === 'skeuomorphism' ? '1px solid rgba(0,0,0,0.12)' :
                     style.id === 'cyberpunk' ? `2px solid ${style.colors.accent}` :
                     style.id === 'material' ? 'none' :
                     style.id === 'flat' ? `2px solid ${style.colors.secondary}` :
                     style.id === 'retro' ? `1px solid ${style.colors.primary}` :
                     style.id === 'swiss' ? '1px solid rgba(0,0,0,0.15)' :
                     style.id === 'memphis' ? '3px solid #000' :
                     style.id === 'grunge' ? `1px solid ${style.colors.primary}` :
                     style.id === 'geometric' ? `2px solid ${style.colors.secondary}` : '1px solid #ccc',
              color: textColor,
              boxShadow: style.id === 'minimalist' ? '0 2px 8px rgba(0,0,0,0.08)' :
                        style.id === 'neumorphism' ? 'inset 4px 4px 8px #1a1d1f, inset -4px -4px 8px #3e444a' :
                        style.id === 'brutalist' ? `4px 4px 0px ${style.colors.primary}` :
                        style.id === 'claymorphism' ? 'inset 0 2px 4px rgba(123,104,238,0.1)' :
                        style.id === 'skeuomorphism' ? 'inset 0 2px 4px rgba(0,0,0,0.08)' :
                        style.id === 'cyberpunk' ? `0 0 10px ${style.colors.accent}60` :
                        style.id === 'material' ? 'none' :
                        style.id === 'flat' ? 'none' :
                        style.id === 'retro' ? 'none' :
                        style.id === 'swiss' ? 'none' :
                        style.id === 'memphis' ? 'none' :
                        style.id === 'grunge' ? 'none' :
                        style.id === 'geometric' ? 'none' : 'none',
              backdropFilter: style.id === 'glassmorphism' ? 'blur(5px)' : 'none',
              borderRadius: style.id === 'claymorphism' ? '16px' : 
                           style.id === 'material' ? '8px' : 
                           style.id === 'geometric' ? '12px' : '6px',
            }}
          />
        </div>
      </div>

      {/* Color Palette */}
      <div className="mt-6">
        <p className="text-xs mb-2" style={{ color: textColor, opacity: 0.7 }}>Color Palette:</p>
        <div className="flex gap-3">
          <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: style.colors.primary }} />
          <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: style.colors.secondary }} />
          <div className="flex-1 h-16 rounded-lg" style={{ backgroundColor: style.colors.accent }} />
        </div>
      </div>

      {/* Typography Sample */}
      <div className="mt-4 p-4 rounded-xl" style={{
        backgroundColor: style.id === 'minimalist' ? 'rgba(255,255,255,0.95)' :
                        style.id === 'brutalist' ? '#fff' :
                        style.id === 'neumorphism' ? style.colors.secondary :
                        style.id === 'claymorphism' ? '#fff' :
                        style.id === 'skeuomorphism' ? '#fff' :
                        style.id === 'cyberpunk' ? '#1a1f3a' :
                        style.id === 'material' ? '#fff' :
                        style.id === 'flat' ? '#E8F5E9' :
                        style.id === 'retro' ? '#fff' :
                        style.id === 'swiss' ? '#fff' :
                        style.id === 'memphis' ? style.colors.secondary :
                        style.id === 'grunge' ? 'rgba(196,168,130,0.1)' :
                        style.id === 'geometric' ? '#fff' : 'rgba(255,255,255,0.05)',
        border: style.id === 'brutalist' ? `6px solid ${style.colors.accent}` :
               style.id === 'neumorphism' ? 'none' :
               style.id === 'claymorphism' ? 'none' :
               style.id === 'skeuomorphism' ? '1px solid rgba(0,0,0,0.08)' :
               style.id === 'cyberpunk' ? `2px solid ${style.colors.primary}` :
               style.id === 'material' ? 'none' :
               style.id === 'flat' ? 'none' :
               style.id === 'retro' ? `2px dashed ${style.colors.primary}` :
               style.id === 'swiss' ? '1px solid rgba(0,0,0,0.08)' :
               style.id === 'memphis' ? '4px solid #000' :
               style.id === 'grunge' ? `2px solid ${style.colors.accent}` :
               style.id === 'geometric' ? 'none' : 'none',
        boxShadow: style.id === 'minimalist' ? '0 8px 24px rgba(0,0,0,0.12)' :
                  style.id === 'brutalist' ? `8px 8px 0px ${style.colors.secondary}` :
                  style.id === 'neumorphism' ? '8px 8px 16px #1a1d1f, -8px -8px 16px #3e444a' :
                  style.id === 'claymorphism' ? '0 8px 24px rgba(123,104,238,0.2)' :
                  style.id === 'skeuomorphism' ? '0 8px 16px rgba(0,0,0,0.12), inset 0 1px 2px rgba(255,255,255,0.5)' :
                  style.id === 'cyberpunk' ? `0 0 20px ${style.colors.primary}80` :
                  style.id === 'material' ? '0 4px 12px rgba(0,0,0,0.15)' :
                  style.id === 'flat' ? 'none' :
                  style.id === 'retro' ? 'none' :
                  style.id === 'swiss' ? '0 2px 8px rgba(0,0,0,0.06)' :
                  style.id === 'memphis' ? 'none' :
                  style.id === 'grunge' ? 'none' :
                  style.id === 'geometric' ? '0 8px 24px rgba(255,106,53,0.15)' : 'none',
        borderRadius: style.id === 'claymorphism' ? '24px' : 
                     style.id === 'material' ? '16px' : 
                     style.id === 'geometric' ? '20px' : '12px',
        transform: style.id === 'memphis' ? 'rotate(-1deg)' : 'none',
      }}>
        <p className="text-xs mb-1" style={{ color: textColor, opacity: 0.7 }}>Typography:</p>
        <p className="text-2xl font-bold mb-1" style={{ color: textColor }}>{style.typography.split(',')[0]}</p>
        <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>
          The quick brown fox jumps over the lazy dog
        </p>
      </div>
    </div>
  );
};

const stepLabels = ['Your Project Blueprint', 'Design Style Selection', 'Design Foundation', 'Generate Assets'] as const;

const UIPrototypeKitModal: React.FC<UIPrototypeKitModalProps> = ({ onClose, problemText, solutionText }) => {
  const [step, setStep] = useState<number>(0);
  const [blueprint, setBlueprint] = useState<BlueprintInputs>({
    projectType: '',
    userPersona: '',
    problemStatement: '',
    keyFeatures: '',
    coreUserTask: '',
    platforms: { mobile: false, web: false, tablet: false, responsive: false },
  });
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [currentStyleIndex, setCurrentStyleIndex] = useState<number>(0);
  const [design, setDesign] = useState<DesignInputs>({
    brandPersonality: '',
    techStack: '',
  });
  const [showStep0Errors, setShowStep0Errors] = useState(false);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  const [showStep2Errors, setShowStep2Errors] = useState(false);

  const prompts = useMemo(() => buildSectionPrompts(problemText, solutionText, blueprint, design, selectedStyle), [problemText, solutionText, blueprint, design, selectedStyle]);

  // Keyboard navigation for carousel (only active on step 1)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (step === 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentStyleIndex((prev) => (prev === 0 ? DESIGN_STYLES.length - 1 : prev - 1));
        }
        if (e.key === 'ArrowRight') {
          setCurrentStyleIndex((prev) => (prev === DESIGN_STYLES.length - 1 ? 0 : prev + 1));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  const canProceedStep0 = useMemo(() => {
    return (
      blueprint.projectType.trim().length > 0 &&
      blueprint.userPersona.trim().length > 0 &&
      blueprint.problemStatement.trim().length > 0 &&
      normalizeList(blueprint.keyFeatures).length >= 3 &&
      blueprint.coreUserTask.trim().length > 0 &&
      platformsToList(blueprint.platforms).length > 0
    );
  }, [blueprint]);

  const canProceedStep1 = useMemo(() => {
    return selectedStyle.trim().length > 0;
  }, [selectedStyle]);

  const canProceedStep2 = useMemo(() => {
    return normalizeList(design.brandPersonality).length >= 3;
  }, [design]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard`);
    } catch {
      alert('Copy failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl mx-auto border rounded-[24px] shadow-lg"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              UI Prototype Kit
            </h3>
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
            </p>
          </div>
          <button
            className="px-3 py-1 rounded-full text-sm"
            onClick={onClose}
            style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }}
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">
          {step === 0 && (
            <div>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Part 1: Your Project Blueprint</h4>
              <p className="text-xs mb-3" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>Define this once to power the entire kit.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Project Type</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., SaaS dashboard, E-commerce mobile app, Marketing website"
                    value={blueprint.projectType}
                    onChange={(e) => setBlueprint((s) => ({ ...s, projectType: e.target.value }))}
                  />
                  {showStep0Errors && blueprint.projectType.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Project type is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>User Persona</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Who are they, goals, pain points"
                    value={blueprint.userPersona}
                    onChange={(e) => setBlueprint((s) => ({ ...s, userPersona: e.target.value }))}
                  />
                  {showStep0Errors && blueprint.userPersona.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>User persona is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Problem Statement</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="What specific problem are you solving?"
                    value={blueprint.problemStatement}
                    onChange={(e) => setBlueprint((s) => ({ ...s, problemStatement: e.target.value }))}
                  />
                  {showStep0Errors && blueprint.problemStatement.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Problem statement is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Key Features (3–5)</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Comma or newline-separated"
                    value={blueprint.keyFeatures}
                    onChange={(e) => setBlueprint((s) => ({ ...s, keyFeatures: e.target.value }))}
                  />
                  {showStep0Errors && normalizeList(blueprint.keyFeatures).length < 3 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please list at least 3 key features.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Core User Task</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., Book a flight, Publish a blog post"
                    value={blueprint.coreUserTask}
                    onChange={(e) => setBlueprint((s) => ({ ...s, coreUserTask: e.target.value }))}
                  />
                  {showStep0Errors && blueprint.coreUserTask.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Core user task is required.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm block mb-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Target Platforms</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      ['mobile', 'Mobile App (iOS/Android)'],
                      ['web', 'Web App (Desktop)'],
                      ['tablet', 'Tablet'],
                      ['responsive', 'Responsive Website'],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                        <input
                          type="checkbox"
                          checked={(blueprint.platforms as Record<string, boolean>)[key] as boolean}
                          onChange={(e) => setBlueprint((s) => ({ ...s, platforms: { ...s.platforms, [key]: e.target.checked } }))}
                          className="w-4 h-4 rounded border-2 cursor-pointer"
                          style={{
                            borderColor: '#e8ddd0',
                            backgroundColor: (blueprint.platforms as Record<string, boolean>)[key] ? '#403f3e' : '#fff',
                            accentColor: '#403f3e'
                          }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                  {showStep0Errors && platformsToList(blueprint.platforms).length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Select at least one platform.</p>
                  )}
                </div>
              </div>
              {showStep0Errors && !canProceedStep0 && (
                <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: '#d97706', backgroundColor: '#fff7ed', color: '#7c2d12', fontFamily: 'Raleway, sans-serif' }}>
                  <p className="text-sm font-medium">Please fill required fields before proceeding.</p>
                  <p className="text-xs">Click Next again after fixing the highlighted inputs.</p>
                </div>
              )}
            </div>
          )}

          {step === 1 && (() => {
            const currentStyle = DESIGN_STYLES[currentStyleIndex];
            const isSelected = selectedStyle === currentStyle.id;
            
            const goToPrevious = () => {
              setCurrentStyleIndex((prev) => (prev === 0 ? DESIGN_STYLES.length - 1 : prev - 1));
            };
            
            const goToNext = () => {
              setCurrentStyleIndex((prev) => (prev === DESIGN_STYLES.length - 1 ? 0 : prev + 1));
            };
            
            return (
              <div className="relative">
                {/* Style Counter */}
                <div className="text-center mb-3">
                  <p className="text-sm" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                    {currentStyle.name}
                  </p>
                  <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                    Style {currentStyleIndex + 1} of {DESIGN_STYLES.length}
                  </p>
                </div>

                {/* Carousel Container */}
                <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: '400px', maxHeight: '55vh' }}>
                  {/* Full Preview based on style */}
                  <div className="absolute inset-0 p-6 overflow-y-auto" style={{ background: currentStyle.colors.background }}>
                    {/* Style-specific preview components */}
                    <StylePreview style={currentStyle} />
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <svg className="w-6 h-6" style={{ color: '#403f3e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                  >
                    <svg className="w-6 h-6" style={{ color: '#403f3e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Style Info & Selection */}
                <div className="mt-4 p-4 rounded-xl border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <p className="text-sm mb-2" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                    {currentStyle.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {currentStyle.characteristics.map((char, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{ backgroundColor: '#f2e8dc', color: '#666' }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setSelectedStyle(currentStyle.id)}
                    className="w-full py-3 rounded-full text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isSelected ? '#403f3e' : '#f2e8dc',
                      color: isSelected ? '#fff' : '#403f3e',
                      border: `2px solid ${isSelected ? '#403f3e' : '#d8cdbc'}`,
                    }}
                  >
                    {isSelected ? '✓ Selected' : 'Select This Style'}
                  </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-3">
                  {DESIGN_STYLES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStyleIndex(idx)}
                      className="w-2 h-2 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: idx === currentStyleIndex ? '#403f3e' : '#d8cdbc',
                        transform: idx === currentStyleIndex ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
                
                {showStep1Errors && !canProceedStep1 && (
                  <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: '#d97706', backgroundColor: '#fff7ed', color: '#7c2d12', fontFamily: 'Raleway, sans-serif' }}>
                    <p className="text-sm font-medium">Please select a design style to continue.</p>
                  </div>
                )}
              </div>
            );
          })()}

          {step === 2 && (
            <div>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Part 3: Design Foundation</h4>
              <p className="text-xs mb-4" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Complete your design preferences. Your selected design style will automatically inform the design inspiration.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Brand Personality (3–5 adjectives)</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., Modern, Playful, Trustworthy, Minimalist"
                    value={design.brandPersonality}
                    onChange={(e) => setDesign((s) => ({ ...s, brandPersonality: e.target.value }))}
                  />
                  <p className="text-[11px] mt-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                    Use commas between adjectives, e.g., &quot;modern, playful, trustworthy&quot;.
                  </p>
                  {showStep2Errors && normalizeList(design.brandPersonality).length < 3 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please enter at least 3 comma-separated adjectives.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>(Optional) Tech Stack</label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., React + Tailwind, Vue, HTML/CSS"
                    value={design.techStack}
                    onChange={(e) => setDesign((s) => ({ ...s, techStack: e.target.value }))}
                  />
                </div>
              </div>
              {showStep2Errors && !canProceedStep2 && (
                <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: '#d97706', backgroundColor: '#fff7ed', color: '#7c2d12', fontFamily: 'Raleway, sans-serif' }}>
                  <p className="text-sm font-medium">Please complete the required fields to continue.</p>
                  <p className="text-xs">Fix the highlighted inputs and click Next again.</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Part 4: Generate Your Prototype Assets</h4>
              <div className="space-y-5">
                <div className="rounded-2xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-base" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>1. User Flow Mapping</h5>
                    <button className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }} onClick={() => copy(prompts.userFlowPrompt, 'User Flow prompt')}>Copy Prompt</button>
                  </div>
                  <p className="text-xs mt-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>Additional Info Needed: Entry Point and End Goal.</p>
                  <textarea readOnly rows={6} className="mt-2 w-full p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }} value={prompts.userFlowPrompt} />
                </div>

                <div className="rounded-2xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-base" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>2. UI Design & Components</h5>
                    <button className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }} onClick={() => copy(prompts.uiComponentsPrompt, 'UI Components prompt')}>Copy Prompt</button>
                  </div>
                  <p className="text-xs mt-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>Additional Info (Optional): Tech stack.</p>
                  <textarea readOnly rows={6} className="mt-2 w-full p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }} value={prompts.uiComponentsPrompt} />
                </div>

                <div className="rounded-2xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-base" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>3. End-to-End Implementation</h5>
                    <button className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }} onClick={() => copy(prompts.implementationPrompt, 'Implementation prompt')}>Copy Prompt</button>
                  </div>
                  <p className="text-xs mt-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>Additional Info: Generated User Flow and List of Screens.</p>
                  <textarea readOnly rows={6} className="mt-2 w-full p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }} value={prompts.implementationPrompt} />
                </div>

                <div className="rounded-2xl border p-3" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff' }}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-base" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>4. Testing & Validation</h5>
                    <button className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }} onClick={() => copy(prompts.testingPrompt, 'Testing prompt')}>Copy Prompt</button>
                  </div>
                  <p className="text-xs mt-1" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>Additional Info: Success metrics (e.g., task completion rate, time on task).</p>
                  <textarea readOnly rows={6} className="mt-2 w-full p-3 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }} value={prompts.testingPrompt} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t" style={{ borderColor: '#e8ddd0' }}>
          <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
            Fill Parts 1–3, then copy prompts in Part 4.
          </div>
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                className="px-3 py-2 rounded-full"
                style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </button>
            )}
            {step < 3 && (
              <button
                className="px-4 py-2 rounded-full text-white"
                style={{ backgroundColor: '#403f3e', fontFamily: 'Raleway, sans-serif' }}
                onClick={() => {
                  if (step === 0 && !canProceedStep0) {
                    setShowStep0Errors(true);
                    return;
                  }
                  if (step === 1 && !canProceedStep1) {
                    setShowStep1Errors(true);
                    return;
                  }
                  if (step === 2 && !canProceedStep2) {
                    setShowStep2Errors(true);
                    return;
                  }
                  setShowStep0Errors(false);
                  setShowStep1Errors(false);
                  setShowStep2Errors(false);
                  setStep((s) => Math.min(3, s + 1));
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIPrototypeKitModal;


