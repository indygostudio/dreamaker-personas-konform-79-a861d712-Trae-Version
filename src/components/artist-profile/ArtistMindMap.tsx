
import React, { useState, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NodeData, PersonaNodeData } from "@/types/mindmap";
import type { Persona } from "@/types/persona";

interface ArtistMindMapProps {
  personas?: Persona[];
}

export const ArtistMindMap = ({ personas = [] }: ArtistMindMapProps) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a mindmap network based on personas
  useEffect(() => {
    if (!personas || personas.length === 0) {
      setNodes([{
        id: "1",
        type: "input",
        position: { x: 250, y: 0 },
        data: { label: "Artist Core" },
        className: 'rounded-md bg-dreamaker-purple/20 border border-dreamaker-purple/40 shadow-md p-2'
      }]);
      setEdges([]);
      setIsLoading(false);
      return;
    }

    // Create the central node
    const artistNode: Node = {
      id: "central",
      type: "input",
      position: { x: 0, y: 0 },
      data: { 
        label: "Artist Core",
        connectionType: 'hivemind'
      },
      className: 'rounded-md bg-dreamaker-purple border-2 border-dreamaker-purple shadow-md p-2 text-white font-bold animate-pulse'
    };

    // Create nodes for each persona in a circle around the central node
    const radius = Math.max(180, personas.length * 25);
    const personaNodes: Node[] = personas.map((persona, index) => {
      const angle = (index * 2 * Math.PI) / personas.length;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const nodeType = getNodeTypeForPersona(persona.type);
      
      return {
        id: persona.id,
        type: 'default',
        position: { x, y },
        data: {
          label: (
            <div className="flex items-center p-1">
              {persona.avatar_url && (
                <div className="w-8 h-8 rounded-md overflow-hidden mr-2 flex-shrink-0">
                  <img 
                    src={persona.avatar_url} 
                    alt={persona.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{persona.name}</span>
                <span className="text-[10px] text-gray-400">{persona.type?.replace('AI_', '') || 'Character'}</span>
              </div>
            </div>
          ),
          personaId: persona.id,
          personaType: persona.type,
          personaAvatar: persona.avatar_url,
          connectionType: 'persona'
        } as PersonaNodeData,
        className: `rounded-md bg-black/60 border border-${getColorForPersonaType(persona.type)}/60 shadow-md hover:shadow-${getColorForPersonaType(persona.type)}/30 hover:shadow-lg transition-all`
      };
    });

    // Create neural network nodes (small dots representing neurons)
    const neuronNodes: Node[] = Array.from({ length: 25 }, (_, i) => {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius * 0.8;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      
      return {
        id: `neuron-${i}`,
        type: 'default',
        position: { x, y },
        data: { label: '' },
        style: {
          width: 6,
          height: 6,
          backgroundColor: `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, 255, ${Math.random() * 0.5 + 0.3})`,
          borderRadius: '50%',
          border: 'none'
        }
      };
    });

    // Create connections from each persona to the central node
    const personaEdges: Edge[] = personas.map((persona) => ({
      id: `e-central-${persona.id}`,
      source: 'central',
      target: persona.id,
      animated: true,
      style: { stroke: getColorForPersonaType(persona.type), strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.Arrow,
        color: getColorForPersonaType(persona.type),
      }
    }));

    // Create connections between personas of the same type
    const typeConnections: Edge[] = [];
    const personasByType: Record<string, Persona[]> = {};

    personas.forEach(persona => {
      const type = persona.type || 'AI_CHARACTER';
      if (!personasByType[type]) {
        personasByType[type] = [];
      }
      personasByType[type].push(persona);
    });

    // Connect personas of the same type
    Object.values(personasByType).forEach(typePersonas => {
      if (typePersonas.length > 1) {
        for (let i = 0; i < typePersonas.length; i++) {
          for (let j = i + 1; j < typePersonas.length; j++) {
            const source = typePersonas[i];
            const target = typePersonas[j];
            
            // Only connect some pairs to avoid too many connections
            if (Math.random() > 0.6) continue;
            
            typeConnections.push({
              id: `e-${source.id}-${target.id}`,
              source: source.id,
              target: target.id,
              animated: true,
              style: { 
                stroke: getColorForPersonaType(source.type),
                strokeWidth: 1,
                opacity: 0.5 
              }
            });
          }
        }
      }
    });

    // Connect some neuron nodes to personas and central node
    const neuronEdges: Edge[] = [];
    
    // Connect neurons to central node
    for (let i = 0; i < 10; i++) {
      neuronEdges.push({
        id: `e-neuron-central-${i}`,
        source: `neuron-${i}`,
        target: 'central',
        animated: true,
        style: { 
          stroke: 'rgba(168, 85, 247, 0.4)',
          strokeWidth: 1,
          opacity: 0.4
        }
      });
    }
    
    // Connect neurons to random personas
    for (let i = 0; i < 15; i++) {
      if (personas.length === 0) continue;
      
      const randomPersona = personas[Math.floor(Math.random() * personas.length)];
      neuronEdges.push({
        id: `e-neuron-persona-${i}`,
        source: `neuron-${i + 10}`,
        target: randomPersona.id,
        animated: true,
        style: { 
          stroke: `rgba(${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, 255, 0.3)`,
          strokeWidth: 1,
          opacity: 0.3
        }
      });
    }
    
    // Connect neurons to other neurons
    for (let i = 0; i < 15; i++) {
      const source = Math.floor(Math.random() * 25);
      let target = Math.floor(Math.random() * 25);
      
      // Make sure source and target are different
      while (source === target) {
        target = Math.floor(Math.random() * 25);
      }
      
      neuronEdges.push({
        id: `e-neuron-neuron-${i}`,
        source: `neuron-${source}`,
        target: `neuron-${target}`,
        animated: true,
        style: { 
          stroke: 'rgba(150, 150, 255, 0.2)',
          strokeWidth: 1,
          opacity: 0.2
        }
      });
    }

    setNodes([artistNode, ...personaNodes, ...neuronNodes]);
    setEdges([...personaEdges, ...typeConnections, ...neuronEdges]);
    setIsLoading(false);
  }, [personas]);

  // Helper function to get color based on persona type
  const getColorForPersonaType = (type?: string): string => {
    switch(type) {
      case 'AI_VOCALIST': return '#a855f7'; // purple
      case 'AI_INSTRUMENTALIST': return '#3b82f6'; // blue
      case 'AI_EFFECT': return '#10b981'; // green
      case 'AI_SOUND': return '#f59e0b'; // amber
      case 'AI_MIXER': return '#06b6d4'; // cyan
      case 'AI_WRITER': return '#8b5cf6'; // violet
      default: return '#6b7280'; // gray
    }
  };

  // Helper function to get node type based on persona type
  const getNodeTypeForPersona = (type?: string): string => {
    switch(type) {
      case 'AI_VOCALIST': return 'output';
      case 'AI_INSTRUMENTALIST': return 'default';
      case 'AI_MIXER': return 'input';
      default: return 'default';
    }
  };

  // Add a demo connection between two random personas
  const handleAddConnection = () => {
    if (personas.length < 2) {
      toast.error("Need at least two personas to create connections");
      return;
    }

    // Find two random distinct personas
    const idx1 = Math.floor(Math.random() * personas.length);
    let idx2 = Math.floor(Math.random() * personas.length);
    while (idx2 === idx1) {
      idx2 = Math.floor(Math.random() * personas.length);
    }

    const newEdge: Edge = {
      id: `e-random-${Date.now()}`,
      source: personas[idx1].id,
      target: personas[idx2].id,
      animated: true,
      style: { stroke: '#fff', strokeWidth: 2, opacity: 0.6 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      }
    };

    setEdges(edges => [...edges, newEdge]);
    toast.success(`Connected ${personas[idx1].name} to ${personas[idx2].name}`);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          onClick={handleAddConnection} 
          className="bg-dreamaker-purple hover:bg-dreamaker-purple/80"
          disabled={personas.length < 2}
        >
          Add Connection
        </Button>
        <div className="text-xs text-gray-400">
          {personas.length} personas in network
        </div>
      </div>
      <div style={{ height: 600 }} className="border border-white/10 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-6 h-6 border-2 border-dreamaker-purple border-t-transparent rounded-full mb-2 mx-auto"></div>
              <p className="text-sm text-gray-400">Building neural network...</p>
            </div>
          </div>
        ) : (
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            className="bg-black/40"
            minZoom={0.2}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            attributionPosition="bottom-right"
            fitView
          >
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              nodeColor={(node) => {
                const data = node.data as PersonaNodeData;
                return data?.connectionType === 'hivemind' ? '#a855f7' : 
                  data?.connectionType === 'persona' ? '#111' : '#333';
              }}
            />
            <Background 
              color="#444"
              gap={16}
              size={1}
              variant={BackgroundVariant.Dots}
            />
            
            {/* SVG Definitions for gradient edges */}
            <svg style={{ width: 0, height: 0 }}>
              <defs>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#d8b4fe" />
                </linearGradient>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
            </svg>
          </ReactFlow>
        )}
      </div>
    </div>
  );
};
