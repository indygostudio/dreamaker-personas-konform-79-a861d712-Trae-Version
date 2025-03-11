
import { Handle, Position, Node } from '@xyflow/react';
import type { Persona } from '@/types/persona';

interface NetworkConfigurationProps {
  persona?: Persona;
}

export const NetworkConfiguration = ({ persona }: NetworkConfigurationProps) => {
  const initialNodes: Node[] = [
    {
      id: 'voice-engine',
      type: 'custom',
      position: { x: 250, y: 100 },
      data: { label: 'Voice Engine' }
    },
    {
      id: 'voice-design',
      type: 'custom',
      position: { x: 250, y: 300 },
      data: { label: 'Voice Design' }
    },
    {
      id: 'model-optimization',
      type: 'custom',
      position: { x: 500, y: 200 },
      data: { label: 'Model Optimization' }
    }
  ];

  const initialEdges = [
    {
      id: 'e1-2',
      source: 'voice-engine',
      target: 'voice-design',
      animated: true,
    },
    {
      id: 'e1-3',
      source: 'voice-engine',
      target: 'model-optimization',
      animated: true,
    },
    {
      id: 'e2-3',
      source: 'voice-design',
      target: 'model-optimization',
      animated: true,
    }
  ];

  return {
    initialNodes,
    initialEdges,
  };
};
