'use client';

import React from 'react';
import TechStackChecklist from './TechStackChecklist';

interface TechStackChecklistModalProps {
  onClose: () => void;
}

const TechStackChecklistModal: React.FC<TechStackChecklistModalProps> = ({ onClose }) => {

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
              Tech Stack Checklist
            </h3>
            <p className="text-xs" style={{ fontFamily: 'Raleway, sans-serif', color: '#666' }}>
              Technical decisions and actions for robust, low-bandwidth applications
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
          <TechStackChecklist showHeader={false} showFooter={false} />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: '#e8ddd0', backgroundColor: '#f2e8dc' }}>
          <TechStackChecklist showHeader={false} showFooter={true} />
        </div>
      </div>
    </div>
  );
};

export default TechStackChecklistModal;
