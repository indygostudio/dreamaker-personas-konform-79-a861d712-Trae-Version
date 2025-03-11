
import React, { useState } from 'react';
import { Persona } from '@/types/persona';

export interface ExtensionFormProps {
  persona?: Persona;
}

export function ExtensionForm({ persona }: ExtensionFormProps) {
  return (
    <div>
      {/* Song extension form UI */}
      <p>Song Extension form will go here. Persona ID: {persona?.id || 'Not set'}</p>
    </div>
  );
}
