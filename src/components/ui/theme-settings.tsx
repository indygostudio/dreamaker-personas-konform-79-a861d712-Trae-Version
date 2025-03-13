import { useThemeStore } from '@/stores/themeStore'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'

export function ThemeSettings() {
  const {
    fontType,
    colorScheme,
    primaryColor,
    secondaryColor,
    accentColor,
    textColor,
    backgroundColor,
    cardColor,
    borderColor,
    setFontType,
    setColorScheme,
    setPrimaryColor,
    setSecondaryColor,
    setAccentColor,
    setTextColor,
    setBackgroundColor,
    setCardColor,
    setBorderColor,
    resetTheme
  } = useThemeStore()

  return (
    <div className="space-y-6 p-4 bg-black/40 backdrop-blur-xl rounded-lg border border-konform-neon-blue/20">
      <div className="space-y-2">
        <Label>Font Type</Label>
        <Select value={fontType} onValueChange={setFontType}>
          <SelectTrigger>
            <SelectValue placeholder="Select font type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="sans">Sans</SelectItem>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Color Scheme</Label>
        <Select value={colorScheme} onValueChange={setColorScheme}>
          <SelectTrigger>
            <SelectValue placeholder="Select color scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="light">Light</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Primary Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Secondary Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Text Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Card Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={cardColor}
            onChange={(e) => setCardColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={cardColor}
            onChange={(e) => setCardColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Border Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="w-12 h-8 p-1 bg-transparent"
          />
          <Input
            type="text"
            value={borderColor}
            onChange={(e) => setBorderColor(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      <Button
        onClick={resetTheme}
        variant="outline"
        className="w-full glass-button"
      >
        Reset Theme
      </Button>
    </div>
  )
}