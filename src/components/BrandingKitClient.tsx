'use client';

import React, { useState } from 'react';
import BrandingKitCard from './BrandingKitCard';
import BrandingKitModal from './BrandingKitModal';

interface BrandingKitClientProps {
  problemText: string;
  solutionText: string;
  defaultBusinessName?: string;
}

export default function BrandingKitClient({ problemText, solutionText, defaultBusinessName }: BrandingKitClientProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <BrandingKitCard onStartBuilding={() => setOpen(true)} />
      {open && (
        <BrandingKitModal
          problemText={problemText}
          solutionText={solutionText}
          defaultBusinessName={defaultBusinessName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}