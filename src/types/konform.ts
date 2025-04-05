export interface Channel {
  id: string;
  number: number;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  type: 'master' | 'bus' | 'audio' | 'instrument' | 'input' | 'fx' | 'aux' | 'vca';
  color?: string;
  instrument?: {
    name: string;
    type: string;
  };
  groupId?: string;
  isGrouped?: boolean;
  isFolderTrack?: boolean;
  isLink?: boolean;
  linkPeers?: string[];
  sends?: Array<{
    target: string;
    targetId: string;
    level: number;
    preFader: boolean;
  }>;
  isPrefaderMetering?: boolean;
  isMonitoring?: boolean;
  monitorMode?: 'auto' | 'on' | 'off' | 'tapeMachine';
  gainReduction?: number;
  inputGain?: number;
  phase?: boolean;
  isSoloSafe?: boolean;
  inputs?: string[];
  outputs?: string[];
  automationMode?: 'off' | 'read' | 'touch' | 'write' | 'latch';
  persona?: {
    id: string;
    name: string;
    type?: string;
    avatarUrl?: string;
  };
  isSelected?: boolean;
  meterMode?: 'peak' | 'rms' | 'peakRMS' | 'lufs' | 'k12' | 'k14' | 'k20';
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