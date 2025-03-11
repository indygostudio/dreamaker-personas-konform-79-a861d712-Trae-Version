import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsSheet = ({ open, onOpenChange }: SettingsSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] bg-konform-surface border-konform-border">
        <SheetHeader>
          <SheetTitle className="text-white">Konform Settings</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-konform-accent">Audio Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Input Device</span>
                <select className="bg-konform-border text-sm rounded-md border-none">
                  <option>Default Input</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Output Device</span>
                <select className="bg-konform-border text-sm rounded-md border-none">
                  <option>Default Output</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sample Rate</span>
                <select className="bg-konform-border text-sm rounded-md border-none">
                  <option>44.1 kHz</option>
                  <option>48 kHz</option>
                  <option>96 kHz</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Buffer Size</span>
                <select className="bg-konform-border text-sm rounded-md border-none">
                  <option>256</option>
                  <option>512</option>
                  <option>1024</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-konform-accent">Interface Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Peak Meters</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Show Grid Lines</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-Save (minutes)</span>
                <select className="bg-konform-border text-sm rounded-md border-none">
                  <option>1</option>
                  <option>5</option>
                  <option>10</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};