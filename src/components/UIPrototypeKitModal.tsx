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
  designInspiration: string; // free text/links
  techStack?: string; // optional for components generation
};

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

function buildSectionPrompts(problemText: string | undefined, solutionText: string | undefined, blueprint: BlueprintInputs, design: DesignInputs) {
  const features = normalizeList(blueprint.keyFeatures);
  const personality = normalizeList(design.brandPersonality);
  const platforms = platformsToList(blueprint.platforms);

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
    design_inspiration: design.designInspiration,
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

const stepLabels = ['Your Project Blueprint', 'Design Foundation', 'Generate Assets'] as const;

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
  const [design, setDesign] = useState<DesignInputs>({
    brandPersonality: '',
    designInspiration: '',
    techStack: '',
  });
  const [showStep0Errors, setShowStep0Errors] = useState(false);
  const [showStep1Errors, setShowStep1Errors] = useState(false);

  const prompts = useMemo(() => buildSectionPrompts(problemText, solutionText, blueprint, design), [problemText, solutionText, blueprint, design]);

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
    return (
      normalizeList(design.brandPersonality).length >= 3 &&
      design.designInspiration.trim().length > 0
    );
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
                          checked={(blueprint.platforms as any)[key] as boolean}
                          onChange={(e) => setBlueprint((s) => ({ ...s, platforms: { ...s.platforms, [key]: e.target.checked } }))}
                          className="w-4 h-4 rounded border-2 cursor-pointer"
                          style={{
                            borderColor: '#e8ddd0',
                            backgroundColor: (blueprint.platforms as any)[key] ? '#403f3e' : '#fff',
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

          {step === 1 && (
            <div>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Part 2: Design Foundation</h4>
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
                    Use commas between adjectives, e.g., "modern, playful, trustworthy".
                  </p>
                  {showStep1Errors && normalizeList(design.brandPersonality).length < 3 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Please enter at least 3 comma-separated adjectives.</p>
                  )}
                </div>
                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>Design Inspiration (links or notes)</label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Websites, apps, styles you admire"
                    value={design.designInspiration}
                    onChange={(e) => setDesign((s) => ({ ...s, designInspiration: e.target.value }))}
                  />
                  {showStep1Errors && design.designInspiration.trim().length === 0 && (
                    <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>Design inspiration is required.</p>
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
              {showStep1Errors && !canProceedStep1 && (
                <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: '#d97706', backgroundColor: '#fff7ed', color: '#7c2d12', fontFamily: 'Raleway, sans-serif' }}>
                  <p className="text-sm font-medium">Please complete the required fields to continue.</p>
                  <p className="text-xs">Fix the highlighted inputs and click Next again.</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h4 className="text-lg mb-3" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>Part 3: Generate Your Prototype Assets</h4>
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
            Fill Parts 1–2, then copy prompts in Part 3.
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
            {step < 2 && (
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
                  setShowStep0Errors(false);
                  setShowStep1Errors(false);
                  setStep((s) => Math.min(2, s + 1));
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


