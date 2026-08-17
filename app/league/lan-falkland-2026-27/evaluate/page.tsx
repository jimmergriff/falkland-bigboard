'use client';

import React from 'react';
import { MobileEvaluator } from '@/components/MobileEvaluator';

export default function EvaluatePage() {
  // Get owner name from localStorage (set during login)
  const ownerName = typeof window !== 'undefined' 
    ? localStorage.getItem('userRole') || 'Roy'
    : 'Roy';

  return <MobileEvaluator ownerName={ownerName} />;
}
