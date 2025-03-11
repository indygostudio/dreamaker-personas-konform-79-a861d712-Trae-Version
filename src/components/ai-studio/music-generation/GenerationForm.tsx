
import React, { useState } from 'react';
import { Persona } from '@/types/persona';

export interface GenerationFormProps {
  persona?: Persona;
}

export function GenerationForm({ persona }: GenerationFormProps) {
  return (
    <div>
      {/* Music generation form UI */}
      <p>Music Generation form will go here. Persona ID: {persona?.id || 'Not set'}</p>
    </div>
  );
}
