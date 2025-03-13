import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FontType = 'system' | 'sans' | 'serif' | 'mono'
type ColorScheme = 'dark' | 'light' | 'system'

interface ThemeState {
  fontType: FontType
  colorScheme: ColorScheme
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  backgroundColor: string
  cardColor: string
  borderColor: string
  setFontType: (font: FontType) => void
  setColorScheme: (scheme: ColorScheme) => void
  setPrimaryColor: (color: string) => void
  setSecondaryColor: (color: string) => void
  setAccentColor: (color: string) => void
  setTextColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  setCardColor: (color: string) => void
  setBorderColor: (color: string) => void
  resetTheme: () => void
}

const defaultTheme = {
  fontType: 'system' as FontType,
  colorScheme: 'dark' as ColorScheme,
  primaryColor: '#10b981',
  secondaryColor: '#3b82f6',
  accentColor: '#8b5cf6',
  textColor: '#ffffff',
  backgroundColor: '#000000',
  cardColor: '#1a1a1a',
  borderColor: '#2a2a2a'
}

export const useThemeStore = create<ThemeState>(
  persist(
    (set) => ({
      ...defaultTheme,
      setFontType: (font) => set({ fontType: font }),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setSecondaryColor: (color) => set({ secondaryColor: color }),
      setAccentColor: (color) => set({ accentColor: color }),
      setTextColor: (color) => set({ textColor: color }),
      setBackgroundColor: (color) => set({ backgroundColor: color }),
      setCardColor: (color) => set({ cardColor: color }),
      setBorderColor: (color) => set({ borderColor: color }),
      resetTheme: () => set(defaultTheme)
    }),
    {
      name: 'dreamaker-theme-storage'
    }
  )
)