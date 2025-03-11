
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorExtractor } from '@/hooks/useColorExtractor';

interface ColorSchemeContextProps {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

const ColorSchemeContext = createContext<ColorSchemeContextProps | undefined>(undefined);

export const ColorSchemeProvider: React.FC<{
  children: ReactNode;
  imageUrl: string | null;
}> = ({ children, imageUrl }) => {
  const colors = useColorExtractor(imageUrl);

  return (
    <ColorSchemeContext.Provider value={{ colors }}>
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ColorSchemeProvider');
  }
  return context;
};
