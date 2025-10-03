'use client';

import React, { useState, useMemo } from 'react';

interface SocialMediaContentModalProps {
  onClose: () => void;
}

interface ProjectIdentity {
  projectName: string;
  oneSentencePitch: string;
  targetAudience: string;
  brandVoice: string[];
  problem: string;
  solution: string;
  journeyMission?: string; // Optional field
}

interface ContentStrategy {
  primaryGoal: string;
  contentPillars: string[];
}

interface PlatformDuration {
  platforms: string[];
  postingFrequency: string;
  planDuration: string;
}

const SocialMediaContentModal: React.FC<SocialMediaContentModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(0);
  const [projectIdentity, setProjectIdentity] = useState<ProjectIdentity>({
    projectName: '',
    oneSentencePitch: '',
    targetAudience: '',
    brandVoice: [],
    problem: '',
    solution: '',
    journeyMission: '',
  });
  const [contentStrategy, setContentStrategy] = useState<ContentStrategy>({
    primaryGoal: '',
    contentPillars: [],
  });
  const [platformDuration, setPlatformDuration] = useState<PlatformDuration>({
    platforms: [],
    postingFrequency: '',
    planDuration: '',
  });
  const [generated, setGenerated] = useState<string>('');
  const [showErrors, setShowErrors] = useState<boolean[]>([false, false, false]);

  const stepLabels = ['Project Identity', 'Content Strategy', 'Platform & Duration', 'Generate Content Calendar'] as const;

  const brandVoiceOptions = ['Professional', 'Friendly', 'Humorous', 'Inspiring', 'Technical', 'Authoritative'];
  const primaryGoalOptions = ['Build Brand Awareness', 'Drive Website Clicks', 'Educate Users', 'Build a Community'];
  const contentPillarOptions = [
    { id: 'problem', label: 'The Problem', description: 'Posts that highlight the problem you are solving.' },
    { id: 'solution', label: 'The Solution', description: 'Posts that explain how your product works.' },
    { id: 'founder', label: 'Founder Story', description: 'Posts about your journey and mission.' },
    { id: 'testimonials', label: 'User Testimonials', description: 'Posts featuring quotes or stories from your users.' },
    { id: 'howto', label: 'How-To Guides', description: 'Posts that provide value and teach your audience something.' },
    { id: 'behind', label: 'Behind the Scenes', description: 'Posts showing your team and your process.' },
    { id: 'community', label: 'Community Spotlight', description: 'Posts that feature your partners or users.' },
  ];
  const platformOptions = ['Facebook', 'WhatsApp Status', 'TikTok', 'Instagram', 'Twitter/X'];
  const frequencyOptions = ['2 times a week', '3 times a week', '5 times a week'];
  const durationOptions = ['1 Month', '2 Months', '3 Months'];

  const canProceedStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Project Identity
        return (
          projectIdentity.projectName.trim().length > 0 &&
          projectIdentity.oneSentencePitch.trim().length > 0 &&
          projectIdentity.targetAudience.trim().length > 0 &&
          projectIdentity.brandVoice.length >= 1 && projectIdentity.brandVoice.length <= 3 &&
          projectIdentity.problem.trim().length > 0 &&
          projectIdentity.solution.trim().length > 0
        );
      case 1: // Content Strategy
        return (
          contentStrategy.primaryGoal.length > 0 &&
          contentStrategy.contentPillars.length >= 3 && contentStrategy.contentPillars.length <= 4
        );
      case 2: // Platform & Duration
        return (
          platformDuration.platforms.length > 0 &&
          platformDuration.postingFrequency.length > 0 &&
          platformDuration.planDuration.length > 0
        );
      default:
        return true;
    }
  };

  const canGenerate = useMemo(() => {
    return [0, 1, 2].every(i => canProceedStep(i));
  }, [projectIdentity, contentStrategy, platformDuration]);

  const handleGenerate = () => {
    const prompt = generatePrompt();
    setGenerated(prompt);
    setStep(3);
  };

  const generatePrompt = () => {
    const selectedPillars = contentPillarOptions.filter(pillar => 
      contentStrategy.contentPillars.includes(pillar.id)
    );

    // Build sections conditionally based on what fields are filled
    let projectOverview = `## Project Overview
**Project Name:** ${projectIdentity.projectName}
**One-Sentence Pitch:** ${projectIdentity.oneSentencePitch}
**Target Audience:** ${projectIdentity.targetAudience}
**Brand Voice:** ${projectIdentity.brandVoice.join(', ')}
**Problem:** ${projectIdentity.problem}
**Solution:** ${projectIdentity.solution}`;

    if (projectIdentity.journeyMission && projectIdentity.journeyMission.trim().length > 0) {
      projectOverview += `\n**Journey & Mission:** ${projectIdentity.journeyMission}`;
    }

    let contextSection = `**Context:**
- Project: ${projectIdentity.oneSentencePitch}
- Target Audience: ${projectIdentity.targetAudience}
- Brand Voice: ${projectIdentity.brandVoice.join(', ')}
- Primary Goal: ${contentStrategy.primaryGoal}
- Problem: ${projectIdentity.problem}
- Solution: ${projectIdentity.solution}`;

    if (projectIdentity.journeyMission && projectIdentity.journeyMission.trim().length > 0) {
      contextSection += `\n- Journey & Mission: ${projectIdentity.journeyMission}`;
    }

    return `# Social Media Content Calendar Generator Prompt

${projectOverview}

## Content Strategy
**Primary Goal:** ${contentStrategy.primaryGoal}
**Content Pillars:**
${selectedPillars.map(pillar => `- **${pillar.label}:** ${pillar.description}`).join('\n')}

## Platform & Posting Details
**Platforms:** ${platformDuration.platforms.join(', ')}
**Posting Frequency:** ${platformDuration.postingFrequency}
**Plan Duration:** ${platformDuration.planDuration}

---

## Prompt for AI Content Generator:

Create a comprehensive social media content calendar for ${projectIdentity.projectName} with the following specifications:

${contextSection}

**Content Requirements:**
Generate ${platformDuration.postingFrequency} posts for ${platformDuration.planDuration} across ${platformDuration.platforms.join(', ')}.

**Content Pillars to Include:**
${selectedPillars.map(pillar => `- ${pillar.label}: ${pillar.description}`).join('\n')}

**Output Format:**
Please provide:
1. A weekly content calendar with specific post ideas
2. For each post, include:
   - Platform-specific copy
   - Suggested hashtags
   - Content pillar category
   - Call-to-action
   - Visual content suggestions

**Tone & Style:**
Maintain a ${projectIdentity.brandVoice.join(', ').toLowerCase()} tone throughout all content, ensuring it resonates with ${projectIdentity.targetAudience} and supports the goal of ${contentStrategy.primaryGoal.toLowerCase()}.

Focus on creating engaging, authentic content that builds trust and drives meaningful engagement with the target audience.`;
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} copied to clipboard`);
    } catch {
      alert('Copy failed');
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (newArray: string[]) => void, maxItems?: number) => {
    const newArray = array.includes(item)
      ? array.filter(i => i !== item)
      : maxItems && array.length >= maxItems
      ? array
      : [...array, item];
    setter(newArray);
  };

  const handleNext = () => {
    if (canProceedStep(step)) {
      setStep(step + 1);
      setShowErrors(prev => prev.map((_, i) => i === step ? false : prev[i]));
    } else {
      setShowErrors(prev => prev.map((_, i) => i === step ? true : prev[i]));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative w-full max-w-3xl mx-auto border rounded-[24px] shadow-lg max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              Social Media Content Generator
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
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                1. Project Identity
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Project Name
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="Enter your project name"
                  value={projectIdentity.projectName}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, projectName: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  One-Sentence Pitch
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="What does your project do?"
                  value={projectIdentity.oneSentencePitch}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, oneSentencePitch: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Target Audience
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder='e.g., "University students," "Small business owners," "Farmers in Kenema"'
                  value={projectIdentity.targetAudience}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, targetAudience: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  The Problem
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="What problem does your project solve?"
                  value={projectIdentity.problem}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, problem: e.target.value }))}
                />
                {showErrors[0] && projectIdentity.problem.trim().length === 0 && (
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>
                    Problem description is required.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  The Solution
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="How does your solution fit the problem?"
                  value={projectIdentity.solution}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, solution: e.target.value }))}
                />
                {showErrors[0] && projectIdentity.solution.trim().length === 0 && (
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>
                    Solution description is required.
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Journey & Mission <span className="text-xs text-gray-500">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="Tell us about your journey and mission (optional)"
                  value={projectIdentity.journeyMission}
                  onChange={(e) => setProjectIdentity(s => ({ ...s, journeyMission: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Brand Voice (Select up to 3)
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {brandVoiceOptions.map(voice => (
                    <label key={voice} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projectIdentity.brandVoice.includes(voice)}
                        onChange={() => toggleArrayItem(
                          projectIdentity.brandVoice, 
                          voice, 
                          (newVoice) => setProjectIdentity(s => ({ ...s, brandVoice: newVoice })),
                          3
                        )}
                        className="w-4 h-4 rounded border-2"
                        style={{ borderColor: '#d8cdbc', accentColor: '#403f3e' }}
                      />
                      <span className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                        {voice}
                      </span>
                    </label>
                  ))}
                </div>
                {showErrors[0] && (projectIdentity.brandVoice.length === 0 || projectIdentity.brandVoice.length > 3) && (
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>
                    Please select 1-3 brand voice options.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                2. Content Strategy
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Primary Goal for Social Media
                </label>
                <select
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  value={contentStrategy.primaryGoal}
                  onChange={(e) => setContentStrategy(s => ({ ...s, primaryGoal: e.target.value }))}
                >
                  <option value="">Select your primary goal</option>
                  {primaryGoalOptions.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Content Pillars (Select 3-4 core themes)
                </label>
                <div className="mt-2 space-y-3">
                  {contentPillarOptions.map(pillar => (
                    <label key={pillar.id} className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contentStrategy.contentPillars.includes(pillar.id)}
                        onChange={() => toggleArrayItem(
                          contentStrategy.contentPillars, 
                          pillar.id, 
                          (newPillars) => setContentStrategy(s => ({ ...s, contentPillars: newPillars })),
                          4
                        )}
                        className="mt-1 w-4 h-4 rounded border-2"
                        style={{ borderColor: '#d8cdbc', accentColor: '#403f3e' }}
                      />
                      <div>
                        <div className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                          {pillar.label}
                        </div>
                        <div className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                          {pillar.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                {showErrors[1] && (contentStrategy.contentPillars.length < 3 || contentStrategy.contentPillars.length > 4) && (
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>
                    Please select 3-4 content pillars.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                3. Platform & Duration
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Select Your Primary Platforms
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {platformOptions.map(platform => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={platformDuration.platforms.includes(platform)}
                        onChange={() => toggleArrayItem(
                          platformDuration.platforms, 
                          platform, 
                          (newPlatforms) => setPlatformDuration(s => ({ ...s, platforms: newPlatforms }))
                        )}
                        className="w-4 h-4 rounded border-2"
                        style={{ borderColor: '#d8cdbc', accentColor: '#403f3e' }}
                      />
                      <span className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                        {platform}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Desired Posting Frequency
                </label>
                <select
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  value={platformDuration.postingFrequency}
                  onChange={(e) => setPlatformDuration(s => ({ ...s, postingFrequency: e.target.value }))}
                >
                  <option value="">Select posting frequency</option>
                  {frequencyOptions.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Plan Duration
                </label>
                <select
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  value={platformDuration.planDuration}
                  onChange={(e) => setPlatformDuration(s => ({ ...s, planDuration: e.target.value }))}
                >
                  <option value="">Select plan duration</option>
                  {durationOptions.map(duration => (
                    <option key={duration} value={duration}>{duration}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                Generated Content Calendar Prompt
              </h4>
              <div
                className="p-4 rounded-lg border max-h-96 overflow-y-auto"
                style={{ borderColor: '#e8ddd0', backgroundColor: '#f9f9f9' }}
              >
                <pre
                  className="text-sm whitespace-pre-wrap"
                  style={{ fontFamily: 'monospace', color: '#403f3e' }}
                >
                  {generated}
                </pre>
              </div>
              <button
                onClick={() => copy(generated, 'Content Calendar Prompt')}
                className="w-full py-3 rounded-full text-sm"
                style={{ backgroundColor: '#403f3e', color: '#f7efe3' }}
              >
                Copy Prompt to Clipboard
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step < 3 && (
          <div className="px-5 py-4 border-t flex justify-between" style={{ borderColor: '#e8ddd0' }}>
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-2 rounded-full text-sm disabled:opacity-50"
              style={{ backgroundColor: '#f2e8dc', border: '1px solid #d8cdbc', color: '#403f3e' }}
            >
              Previous
            </button>
            <button
              onClick={step === 2 ? handleGenerate : handleNext}
              disabled={!canProceedStep(step)}
              className="px-4 py-2 rounded-full text-sm disabled:opacity-50"
              style={{ backgroundColor: '#403f3e', color: '#f7efe3' }}
            >
              {step === 2 ? 'Generate Content Calendar' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaContentModal;
