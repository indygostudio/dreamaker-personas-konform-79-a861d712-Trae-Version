export interface Channel {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  type: 'master' | 'bus' | 'audio';
  color?: string;
  instrument?: {
    name: string;
    type: string;
  };
}

export interface ChannelStripProps {
  channel: Channel;
  onVolumeChange: (value: number) => void;
  onPanChange: (value: number) => void;
  onMute: () => void;
  onSolo: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onColorChange?: (color: string) => void;
}