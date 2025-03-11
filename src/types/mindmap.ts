
import { Node as ReactFlowNode, Edge as ReactFlowEdge } from "@xyflow/react";
import { ReactNode } from "react";

export interface NodeParameter {
  [key: string]: string | number;
}

export interface NodeData {
  label: string | ReactNode;
  parameters: NodeParameter;
  [key: string]: unknown;
}

export interface EdgeData {
  label?: string;
  animated?: boolean;
}

export interface NodePositions {
  [nodeId: string]: {
    x: number;
    y: number;
  };
}

export interface MindMapData {
  nodes: ReactFlowNode<NodeData>[];
  edges: ReactFlowEdge[];
}

// Node connection types for personas and AI parameters
export type NodeConnectionType = 'persona' | 'parameter' | 'model' | 'hivemind' | 'music-model' | 'voice-model';

// Enhanced node data with persona information
export interface PersonaNodeData extends NodeData {
  personaId?: string;
  personaType?: string;
  personaAvatar?: string;
  connectionType: NodeConnectionType;
}
