'use client';

import React, { useState } from 'react';

interface TechStackChecklistProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

const TechStackChecklist: React.FC<TechStackChecklistProps> = ({ 
  showHeader = false, 
  showFooter = false 
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleCheck = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const checklistItems = [
    {
      phase: "Phase 1: Foundation & Planning",
      items: [
        {
          id: "project-vitals",
          title: "Define Project Vitals:",
          subitems: [
            { id: "project-goal", text: "Clearly state the project's primary goal in one sentence." },
            { id: "primary-user", text: "Identify the primary user (e.g., General Public, Business Owner)." },
            { id: "primary-platform", text: "Choose the primary platform (e.g., Web App, WhatsApp Bot, USSD)." }
          ]
        },
        {
          id: "core-technology",
          title: "Select Core Technology (Based on Application Type):",
          subitems: [
            { id: "simple-website", text: "For a Simple Website: Choose a Static Site Generator (e.g., Next.js) and a Headless CMS (e.g., Strapi)." },
            { id: "interactive-web", text: "For an Interactive Web App: Choose a Frontend (e.g., React), Backend (e.g., Node.js), and Database (e.g., PostgreSQL)." },
            { id: "mobile-app", text: "For a Mobile App: Choose a Framework (e.g., React Native, Flutter) and a Backend-as-a-Service (e.g., Firebase, Supabase)." }
          ]
        },
        {
          id: "blockchain-consideration",
          title: "Consider Blockchain (If your project requires decentralization, transparency, or immutability):",
          subitems: [
            { id: "blockchain-usecase", text: "Identify the core use case (e.g., Supply Chain Tracking, Digital Identity, Voting)." },
            { id: "blockchain-platform", text: "Choose a suitable blockchain platform (e.g., Ethereum for smart contracts, a specific Layer-2 for scalability)." },
            { id: "blockchain-data", text: "Define the on-chain vs. off-chain data strategy." }
          ]
        },
        {
          id: "ai-consideration",
          title: "Consider AI (If your project requires prediction, personalization, or automation):",
          subitems: [
            { id: "ai-usecase", text: "Identify the core use case (e.g., Recommendation Engine, Chatbot, Credit Scoring)." },
            { id: "ai-model", text: "Select a model/framework (e.g., use a pre-trained model via API like OpenAI, or a custom model with TensorFlow/PyTorch)." },
            { id: "ai-data", text: "Plan your data collection and training strategy." }
          ]
        }
      ]
    },
    {
      phase: "Phase 2: Development & Integration",
      items: [
        {
          id: "low-bandwidth",
          title: "Implement Low-Bandwidth Principles:",
          subitems: [
            { id: "optimize-images", text: "Optimize all images for the web (e.g., use WebP format)." },
            { id: "offline-features", text: "Design core features to function offline where possible." },
            { id: "text-priority", text: "Prioritize text over heavy media assets." },
            { id: "sms-notifications", text: "Plan for critical notifications via SMS or USSD." }
          ]
        },
        {
          id: "mobile-money",
          title: "Integrate Mobile Money:",
          subitems: [
            { id: "money-providers", text: "Identify required providers (Orange Money, Africell Money)." },
            { id: "api-keys", text: "Apply for and securely store API keys." },
            { id: "callback-url", text: "Set up and test your callback URL for transaction notifications." },
            { id: "sandbox-testing", text: "Test all transaction types in the provider's sandbox environment." }
          ]
        }
      ]
    },
    {
      phase: "Phase 3: Launch & Maintenance",
      items: [
        {
          id: "pre-launch",
          title: "Complete Pre-Launch Checklist:",
          subitems: [
            { id: "domain-config", text: "Register and configure your domain name." },
            { id: "ssl-certificate", text: "Install an SSL certificate to enable HTTPS." },
            { id: "environments", text: "Set up separate 'staging' (for testing) and 'production' (live) environments." },
            { id: "performance-testing", text: "Conduct final load and performance testing." }
          ]
        },
        {
          id: "launch-execution",
          title: "Execute Launch:",
          subitems: [
            { id: "deploy-code", text: "Deploy the final code to the production server." },
            { id: "monitor-logs", text: "Monitor logs for any immediate errors or issues." }
          ]
        },
        {
          id: "post-launch",
          title: "Establish Post-Launch Protocols:",
          subitems: [
            { id: "automated-backups", text: "Configure automated, regular backups of your database." },
            { id: "uptime-monitoring", text: "Set up an uptime monitoring service to get alerts if your site goes down." }
          ]
        }
      ]
    }
  ];

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Checklist copied to clipboard');
    } catch {
      alert('Copy failed');
    }
  };

  const generateChecklistText = () => {
    let text = "Tech Stack Checklist\n\n";
    
    checklistItems.forEach(phase => {
      text += `${phase.phase}\n`;
      phase.items.forEach(item => {
        text += `[ ] ${item.title}\n`;
        item.subitems.forEach(subitem => {
          text += `[ ] ${subitem.text}\n`;
        });
        text += "\n";
      });
      text += "\n";
    });
    
    return text;
  };

  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex items-center justify-between px-5 py-4 border-b mb-6" style={{ borderColor: '#e8ddd0' }}>
          <div>
            <h3 className="text-xl" style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e', fontWeight: 500 }}>
              Tech Stack Checklist
            </h3>
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              Technical decisions and actions for robust, low-bandwidth applications
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="space-y-6">
        {checklistItems.map((phase, phaseIdx) => (
          <div key={phaseIdx}>
            <h4 
              className="text-lg mb-4 font-medium"
              style={{ fontFamily: 'Decoy, sans-serif', color: '#403f3e' }}
            >
              {phase.phase}
            </h4>
            
            <div className="space-y-4">
              {phase.items.map((item, itemIdx) => (
                <div key={itemIdx} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={item.id}
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-1 w-4 h-4 rounded border-2"
                      style={{ borderColor: '#d8cdbc', accentColor: '#403f3e' }}
                    />
                    <label 
                      htmlFor={item.id}
                      className="text-sm font-medium cursor-pointer"
                      style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
                    >
                      {item.title}
                    </label>
                  </div>
                  
                  <div className="ml-7 space-y-2">
                    {item.subitems.map((subitem, subIdx) => (
                      <div key={subIdx} className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={subitem.id}
                          checked={checkedItems.has(subitem.id)}
                          onChange={() => toggleCheck(subitem.id)}
                          className="mt-1 w-4 h-4 rounded border-2"
                          style={{ borderColor: '#d8cdbc', accentColor: '#403f3e' }}
                        />
                        <label 
                          htmlFor={subitem.id}
                          className="text-sm cursor-pointer leading-relaxed"
                          style={{ fontFamily: 'Raleway, sans-serif', color: '#403f3e' }}
                        >
                          {subitem.text}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showFooter && (
        <div className="px-5 py-4 border-t mt-6" style={{ borderColor: '#e8ddd0', backgroundColor: '#f2e8dc' }}>
          <div className="flex justify-between items-center">
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              Progress: {checkedItems.size} items completed
            </p>
            <button
              className="px-4 py-2 rounded-full text-sm"
              onClick={() => copy(generateChecklistText())}
              style={{ backgroundColor: '#403f3e', color: '#f7efe3' }}
            >
              Copy Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechStackChecklist;
