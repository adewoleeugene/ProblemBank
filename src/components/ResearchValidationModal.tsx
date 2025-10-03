'use client';

import React, { useState, useMemo } from 'react';

interface ResearchValidationModalProps {
  onClose: () => void;
}

interface IdeaAssumptions {
  idea: string;
  problemAssumption: string;
  solutionAssumption: string;
  marketAssumption: string;
}

interface TargetMarket {
  idealCustomer: string;
  tam: number;
  sam: number;
  som: number;
}

interface CompetitorAnalysis {
  directCompetitor: string;
  indirectCompetitors: string;
}

interface CustomerDiscovery {
  interviewCount: number;
  findingMethod: string;
  keyInsight: string;
}

interface ValidationPrompt {
  stepName: string;
  prompt: string;
  isGenerated: boolean;
}

const ResearchValidationModal: React.FC<ResearchValidationModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(0);
  const [ideaAssumptions, setIdeaAssumptions] = useState<IdeaAssumptions>({
    idea: '',
    problemAssumption: '',
    solutionAssumption: '',
    marketAssumption: '',
  });
  const [targetMarket, setTargetMarket] = useState<TargetMarket>({
    idealCustomer: '',
    tam: 0,
    sam: 0,
    som: 0,
  });
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis>({
    directCompetitor: '',
    indirectCompetitors: '',
  });
  const [customerDiscovery, setCustomerDiscovery] = useState<CustomerDiscovery>({
    interviewCount: 0,
    findingMethod: '',
    keyInsight: '',
  });
  
  const [stepPrompts, setStepPrompts] = useState<ValidationPrompt[]>([
    { stepName: 'Idea & Core Assumptions', prompt: '', isGenerated: false },
    { stepName: 'Target Market Definition', prompt: '', isGenerated: false },
    { stepName: 'Competitor Analysis', prompt: '', isGenerated: false },
    { stepName: 'Customer Discovery & Validation', prompt: '', isGenerated: false },
  ]);
  const [showErrors, setShowErrors] = useState<boolean[]>([false, false, false, false]);

  const stepLabels = ['Idea & Core Assumptions', 'Target Market Definition', 'Competitor Analysis', 'Customer Discovery & Validation'] as const;

  const canProceedStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Idea & Core Assumptions
        return (
          ideaAssumptions.idea.trim().length > 0 &&
          ideaAssumptions.problemAssumption.trim().length > 0 &&
          ideaAssumptions.solutionAssumption.trim().length > 0 &&
          ideaAssumptions.marketAssumption.trim().length > 0
        );
      case 1: // Target Market Definition
        return (
          targetMarket.idealCustomer.trim().length > 0 &&
          targetMarket.tam > 0 &&
          targetMarket.sam > 0 &&
          targetMarket.som > 0
        );
      case 2: // Competitor Analysis
        return (
          competitorAnalysis.directCompetitor.trim().length > 0 &&
          competitorAnalysis.indirectCompetitors.trim().length > 0
        );
      case 3: // Customer Discovery
        return (
          customerDiscovery.interviewCount > 0 &&
          customerDiscovery.findingMethod.trim().length > 0 &&
          customerDiscovery.keyInsight.trim().length > 0
        );
      default:
        return true;
    }
  };

  const generateValidationPrompt = (stepIndex: number, data: any): string => {
    const prompts = {
      0: `# Business Idea Validation for Sierra Leone Market

## Your Business Idea Analysis Request

**Idea:** "${data.idea}"
**Problem Assumption:** "${data.problemAssumption}"
**Solution Assumption:** "${data.solutionAssumption}"
**Market Assumption:** "${data.marketAssumption}"

## Sierra Leone Market Context for Analysis

Please analyze this business idea considering Sierra Leone's specific context:

**Demographics & Infrastructure:**
- Population: ~8 million (60% rural, 40% urban)
- Median age: ~19 years (very young population)
- Mobile penetration: ~130% (multiple SIMs common)
- Internet penetration: ~30-40%
- Key cities: Freetown (~1.2M), Bo (~300K), Kenema (~200K), Makeni (~125K)

**Economic Environment:**
- Economy based on agriculture, mining, and small trade
- High unemployment, especially among youth
- Limited formal business infrastructure
- Strong informal market systems
- Post-conflict recovery ongoing

**Instructions for AI Analysis:**

1. **Validate each assumption** against Sierra Leone's market realities
2. **Assess feasibility** considering local infrastructure and economic conditions
3. **Identify potential challenges** specific to Sierra Leone context
4. **Suggest improvements** to make the idea more viable locally
5. **Provide overall status:** Validated / Needs Major Changes / Not Viable

Please provide detailed feedback focusing on Sierra Leone-specific opportunities and constraints.`,

      1: `# Target Market Validation for Sierra Leone

## Your Market Definition

**Ideal Customer Profile:** "${data.idealCustomer}"
**Total Available Market (TAM):** ${data.tam}
**Serviceable Available Market (SAM):** ${data.sam}
**Serviceable Obtainable Market (SOM):** ${data.som}

## Sierra Leone Market Data for Reference

**Population Distribution:**
- Total population: ~8 million
- Urban centers: Freetown (~1.2M), Bo (~300K), Kenema (~200K), Makeni (~125K)
- Rural areas: ~60% of population
- Youth demographic: 70% under age 35

**Economic Indicators:**
- GDP per capita: ~$500-600 USD
- Currency: Sierra Leonean Leone (SLL)
- Main income sources: Agriculture, mining, small trade, remittances
- Mobile money usage: Orange Money, Africell Money widespread

**Connectivity:**
- Mobile penetration: ~130%
- Internet access: ~30-40%
- Smartphone adoption growing but still limited in rural areas

## Instructions for AI Analysis:

1. **Evaluate ICP realism** - Is this customer profile accurate for Sierra Leone?
2. **Assess market size estimates** - Are TAM/SAM/SOM numbers realistic?
3. **Consider purchasing power** - Can target customers afford the solution?
4. **Analyze accessibility** - Can you realistically reach these customers?
5. **Suggest refinements** to make the target market more accurate

Please provide specific feedback on market size assumptions and customer targeting for Sierra Leone.`,

      2: `# Competitive Analysis for Sierra Leone Market

## Your Competitive Assessment

**Direct Competitor:** "${data.directCompetitor}"
**Indirect Competitors:** "${data.indirectCompetitors}"

## Sierra Leone Business Environment Context

**Formal Business Landscape:**
- Limited venture capital/startup ecosystem
- Few established tech companies
- Government digitization initiatives underway
- Regulatory environment still developing

**Informal Market Systems:**
- Strong traditional trading relationships
- Community-based solutions prevalent
- Word-of-mouth marketing dominant
- Trust-based business relationships

**Financial Infrastructure:**
- Mobile money widespread (Orange Money, Africell Money)
- Limited banking access in rural areas
- Cash-based economy still dominant
- Microfinance institutions present

## Instructions for AI Analysis:

1. **Evaluate direct competition** - Are these real competitors in Sierra Leone?
2. **Assess indirect competition** - What traditional alternatives exist?
3. **Identify market gaps** - Where are opportunities for differentiation?
4. **Consider entry barriers** - What challenges exist for new solutions?
5. **Suggest competitive strategy** - How to position against existing alternatives?

Please provide insights on competitive positioning and market entry strategy for Sierra Leone.`,

      3: `# Customer Discovery Plan for Sierra Leone

## Your Research Approach

**Planned Interviews:** ${data.interviewCount}
**Finding Method:** "${data.findingMethod}"
**Key Insight Discovered:** "${data.keyInsight}"

## Sierra Leone Research Considerations

**Cultural Context:**
- Language diversity: English (official), Krio (widely spoken), Mende, Temne, and other local languages
- Post-conflict society with emphasis on trust-building
- Strong community hierarchies and respect for elders
- Religious diversity (Islam, Christianity, traditional beliefs)

**Practical Considerations:**
- Rural vs urban access differences
- Seasonal availability (especially for farmers - planting/harvest cycles)
- Limited internet for remote interviews
- Transportation challenges to rural areas
- Community leader endorsement often necessary

**Research Best Practices:**
- Community leader engagement crucial
- Local language capabilities needed
- Cultural sensitivity training important
- Trust-building takes time
- Group discussions often more effective than individual interviews

## Instructions for AI Analysis:

1. **Assess interview plan feasibility** - Is the approach realistic for Sierra Leone?
2. **Evaluate finding methods** - Will these work in the local context?
3. **Analyze key insights** - Do they align with known Sierra Leone conditions?
4. **Suggest improvements** - How to make research more effective locally?
5. **Recommend next steps** - What additional validation is needed?

Please provide feedback on the customer discovery approach and insights for Sierra Leone market validation.`
    };

    return prompts[stepIndex as keyof typeof prompts] || '';
  };

  const generateCompletePrompt = () => {
    const completePrompt = `# Complete Business Idea Validation for Sierra Leone Market

## Your Complete Business Research

### 1. Business Idea & Core Assumptions

**Business Idea:** "${ideaAssumptions.idea}"

**Core Assumptions:**
- **Problem Assumption:** "${ideaAssumptions.problemAssumption}"
- **Solution Assumption:** "${ideaAssumptions.solutionAssumption}"
- **Market Assumption:** "${ideaAssumptions.marketAssumption}"

### 2. Target Market Definition

**Ideal Customer Profile:** "${targetMarket.idealCustomer}"

**Market Size Estimates:**
- **Total Available Market (TAM):** ${targetMarket.tam}
- **Serviceable Available Market (SAM):** ${targetMarket.sam}
- **Serviceable Obtainable Market (SOM):** ${targetMarket.som}

### 3. Competitive Landscape

**Direct Competitors:** "${competitorAnalysis.directCompetitor}"

**Indirect Competitors:** "${competitorAnalysis.indirectCompetitors}"

### 4. Customer Discovery Plan

**Planned Interviews:** ${customerDiscovery.interviewCount}
**Customer Finding Method:** "${customerDiscovery.findingMethod}"
**Key Insight Discovered:** "${customerDiscovery.keyInsight}"

---

## Sierra Leone Market Context for Analysis

Please provide comprehensive validation considering Sierra Leone's specific context:

**Demographics & Infrastructure:**
- Population: ~8 million (60% rural, 40% urban)
- Median age: ~19 years (very young population)
- Mobile penetration: ~130% (multiple SIMs common)
- Internet penetration: ~30-40%
- Key cities: Freetown (~1.2M), Bo (~300K), Kenema (~200K), Makeni (~125K)

**Economic Environment:**
- GDP per capita: ~$500-600 USD
- Economy based on agriculture, mining, and small trade
- High unemployment, especially among youth
- Limited formal business infrastructure
- Strong informal market systems
- Post-conflict recovery ongoing

**Business Environment:**
- Limited venture capital/startup ecosystem
- Government digitization initiatives underway
- Mobile money widespread (Orange Money, Africell Money)
- Strong traditional trading relationships
- Trust-based business culture

**Cultural & Research Considerations:**
- Language diversity: English (official), Krio (widely spoken), Mende, Temne
- Post-conflict society with emphasis on trust-building
- Strong community hierarchies and respect for elders
- Seasonal availability (especially for farmers)
- Community leader endorsement often necessary

## Comprehensive Analysis Request

Please analyze this complete business research and provide:

### 1. Assumption Validation
- Validate each core assumption against Sierra Leone market realities
- Assess feasibility considering local infrastructure and economic conditions
- Identify assumptions that need refinement

### 2. Market Size Reality Check
- Evaluate if TAM/SAM/SOM estimates are realistic for Sierra Leone
- Consider purchasing power and accessibility constraints
- Suggest more accurate market sizing if needed

### 3. Competitive Position Analysis
- Assess direct and indirect competition in Sierra Leone context
- Identify traditional alternatives and informal solutions
- Suggest competitive differentiation strategies

### 4. Customer Discovery Evaluation
- Review the feasibility of the interview plan in Sierra Leone
- Assess if the finding methods will work in local context
- Validate key insights against known market conditions
- Recommend improvements for effective local research

### 5. Overall Business Viability
Provide an overall assessment:
- **Status:** Validated / Needs Major Changes / Not Viable for Sierra Leone
- **Key Opportunities:** What makes this idea promising for Sierra Leone?
- **Critical Risks:** What are the biggest challenges and risks?
- **Next Steps:** What should be done to validate or pivot this idea?
- **Local Adaptations:** How should the idea be adapted for Sierra Leone market?

Please provide detailed, actionable feedback focusing on Sierra Leone-specific opportunities, constraints, and recommendations.`;

    // Update prompt state for step 3
    setStepPrompts(prev => prev.map((val, idx) => 
      idx === 3 ? { ...val, prompt: completePrompt, isGenerated: true } : val
    ));
  };

  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      alert('Validation prompt copied to clipboard! You can now paste it into ChatGPT, Claude, or any AI assistant.');
    } catch {
      alert('Copy failed');
    }
  };

  const handleNext = () => {
    if (canProceedStep(step)) {
      if (step < stepLabels.length - 1) {
        setStep(step + 1);
      }
      setShowErrors(prev => prev.map((_, i) => i === step ? false : prev[i]));
    } else {
      setShowErrors(prev => prev.map((_, i) => i === step ? true : prev[i]));
    }
  };

  const getPromptStatusIcon = (stepIndex: number) => {
    const prompt = stepPrompts[stepIndex];
    if (prompt.isGenerated) {
      return <span className="text-sm">📋</span>;
    }
    return null;
  };

  const getPromptStatusText = (stepIndex: number) => {
    const prompt = stepPrompts[stepIndex];
    if (prompt.isGenerated) {
      return 'Prompt Generated';
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative w-full max-w-4xl mx-auto border rounded-[24px] shadow-lg max-h-[90vh] overflow-hidden"
        style={{ backgroundColor: '#fffaf3', borderColor: '#e8ddd0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              Research & Validation Kit 🔬
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
                Step {step + 1} of {stepLabels.length}: {stepLabels[step]}
              </p>
              {getPromptStatusIcon(step) && (
                <span className="flex items-center gap-1 text-xs" style={{ color: '#666' }}>
                  {getPromptStatusIcon(step)}
                  {getPromptStatusText(step)}
                </span>
              )}
            </div>
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
          {/* Step 1: Idea & Core Assumptions */}
          {step === 0 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                1. Idea & Core Assumptions
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Your Idea (One Sentence)
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder='e.g., "A mobile app that connects farmers directly to buyers."'
                  value={ideaAssumptions.idea}
                  onChange={(e) => setIdeaAssumptions(s => ({ ...s, idea: e.target.value }))}
                />
                {showErrors[0] && ideaAssumptions.idea.trim().length === 0 && (
                  <p className="mt-1 text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#a16207' }}>
                    Please describe your idea.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  List Your 3 Biggest Assumptions (What must be true for this idea to succeed?)
                </p>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Problem Assumption
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., I assume farmers biggest problem is finding buyers"
                    value={ideaAssumptions.problemAssumption}
                    onChange={(e) => setIdeaAssumptions(s => ({ ...s, problemAssumption: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Solution Assumption
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder='e.g., "I assume farmers will be willing to use a mobile app to solve this."'
                    value={ideaAssumptions.solutionAssumption}
                    onChange={(e) => setIdeaAssumptions(s => ({ ...s, solutionAssumption: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Market Assumption
                  </label>
                  <input
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder='e.g., "I assume buyers will pay a fee to connect with farmers through an app."'
                    value={ideaAssumptions.marketAssumption}
                    onChange={(e) => setIdeaAssumptions(s => ({ ...s, marketAssumption: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Target Market Definition */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                2. Target Market Definition
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Ideal Customer Profile (ICP)
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder='Describe the very specific person you are building this for. Go beyond demographics. e.g., "Smallholder cassava farmers in Moyamba district, aged 30-50, who own a basic feature phone and belong to a local cooperative."'
                  value={targetMarket.idealCustomer}
                  onChange={(e) => setTargetMarket(s => ({ ...s, idealCustomer: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Market Size Estimation (Guesstimate)
                </p>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Total Available Market (TAM)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How many farmers are in Sierra Leone?"
                    value={targetMarket.tam || ''}
                    onChange={(e) => setTargetMarket(s => ({ ...s, tam: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Serviceable Available Market (SAM)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How many of them have mobile phones and are in our target regions?"
                    value={targetMarket.sam || ''}
                    onChange={(e) => setTargetMarket(s => ({ ...s, sam: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Serviceable Obtainable Market (SOM)
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="How many can we realistically reach in the first 2 years?"
                    value={targetMarket.som || ''}
                    onChange={(e) => setTargetMarket(s => ({ ...s, som: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Competitor Analysis */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                3. Competitor Analysis
              </h4>
              
              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Direct Competitors (Who is solving this exact problem?)
                </label>
                <input
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder="Competitor 1 Name & How they work"
                  value={competitorAnalysis.directCompetitor}
                  onChange={(e) => setCompetitorAnalysis(s => ({ ...s, directCompetitor: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  Indirect Competitors (How do people solve this problem now?)
                </label>
                <textarea
                  rows={4}
                  className="mt-1 w-full p-3 rounded-lg border"
                  style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                  placeholder='e.g., "Farmers currently solve this by using middlemen, calling personal contacts, or physically taking their goods to the nearest large market."'
                  value={competitorAnalysis.indirectCompetitors}
                  onChange={(e) => setCompetitorAnalysis(s => ({ ...s, indirectCompetitors: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Step 4: Customer Discovery & Validation */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-lg" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
                4. Customer Discovery & Validation
              </h4>
              
              <div className="space-y-4">
                <p className="text-sm font-medium" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                  User Interview Plan
                </p>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Number of Interviews to Conduct
                  </label>
                  <input
                    type="number"
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="Aim for 10-15"
                    value={customerDiscovery.interviewCount || ''}
                    onChange={(e) => setCustomerDiscovery(s => ({ ...s, interviewCount: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    How will you find them?
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder="e.g., Visit the market in Moyamba, get introductions through the local farmers association"
                    value={customerDiscovery.findingMethod}
                    onChange={(e) => setCustomerDiscovery(s => ({ ...s, findingMethod: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm" style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}>
                    Key Insight
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full p-3 rounded-lg border"
                    style={{ borderColor: '#e8ddd0', backgroundColor: '#fff', color: '#403f3e' }}
                    placeholder='What did you learn from your interviews? e.g., "Farmers confirmed that finding buyers is a huge problem, but an even bigger problem is the cost of transport."'
                    value={customerDiscovery.keyInsight}
                    onChange={(e) => setCustomerDiscovery(s => ({ ...s, keyInsight: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}


          {/* Prompt Display - Only on final step */}
          {step === 3 && stepPrompts[step].isGenerated && (
            <div className="mt-4 p-4 rounded-lg border" style={{ borderColor: '#e8ddd0', backgroundColor: '#f9f9f9' }}>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => copyPrompt(stepPrompts[step].prompt)}
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ backgroundColor: '#403f3e', color: '#f7efe3' }}
                >
                  Copy Prompt
                </button>
              </div>
              
              <div
                className="text-xs leading-relaxed p-3 rounded border max-h-60 overflow-y-auto"
                style={{ 
                  borderColor: '#d8cdbc', 
                  backgroundColor: '#fff',
                  fontFamily: 'monospace', 
                  color: '#403f3e'
                }}
              >
                <pre className="whitespace-pre-wrap">{stepPrompts[step].prompt}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
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
            onClick={step === stepLabels.length - 1 ? () => generateCompletePrompt() : handleNext}
            disabled={!canProceedStep(step)}
            className="px-4 py-2 rounded-full text-sm disabled:opacity-50"
            style={{ backgroundColor: '#403f3e', color: '#f7efe3' }}
          >
            {step === stepLabels.length - 1 ? 'Generate Validation Prompt' : 'Next Step'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearchValidationModal;
