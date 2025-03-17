import { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Link2, Copy, Clipboard, Trash, Settings } from "lucide-react";

interface DrumPadContextMenuProps {
  children: ReactNode;
  onMidiLearnClick?: (e: React.MouseEvent) => void;
  onCopyClick?: (e: React.MouseEvent) => void;
  onPasteClick?: (e: React.MouseEvent) => void;
  onClearClick?: (e: React.MouseEvent) => void;
  onAssignClick?: (e: React.MouseEvent) => void;
}

export const DrumPadContextMenu = ({
  children,
  onMidiLearnClick,
  onCopyClick,
  onPasteClick,
  onClearClick,
  onAssignClick,
}: DrumPadContextMenuProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-[#1A1F2C] border-red-500/30">
        {onMidiLearnClick && (
          <ContextMenuItem
            onClick={onMidiLearnClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Link2 className="mr-2 h-4 w-4" />
            MIDI Learn
          </ContextMenuItem>
        )}

        {onCopyClick && (
          <ContextMenuItem
            onClick={onCopyClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuItem>
        )}

        {onPasteClick && (
          <ContextMenuItem
            onClick={onPasteClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
          </ContextMenuItem>
        )}

        {onAssignClick && (
          <ContextMenuItem
            onClick={onAssignClick}
            className="flex items-center cursor-pointer text-gray-300 hover:text-white"
          >
            <Settings className="mr-2 h-4 w-4" />
            Assign
          </ContextMenuItem>
        )}

        {onClearClick && (
          <ContextMenuItem
            onClick={onClearClick}
            className="flex items-center cursor-pointer text-red-400 hover:text-red-300"
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};