
import { useState } from 'react';
import type { Persona } from "@/types/persona";
import { PersonaCard } from "@/components/PersonaCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PersonaCardListProps {
  personas: Persona[];
  onEdit: (persona: Persona) => void;
  onDelete: (id: string) => void;
  selectionMode?: boolean;
  selectedPersonas?: Persona[];
  onSelect?: (persona: Persona, selected: boolean) => void;
}

export const PersonaCardList = ({
  personas,
  onEdit,
  onDelete,
  selectionMode = false,
  selectedPersonas = [],
  onSelect
}: PersonaCardListProps) => {
  const [items, setItems] = useState(personas);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update preferred order in Supabase
        updatePreferredOrder(newOrder);

        return newOrder;
      });
    }
  };

  const updatePreferredOrder = async (orderedPersonas: Persona[]) => {
    try {
      const updates = orderedPersonas.map((persona, index) => ({
        id: persona.id,
        preferred_order: index
      }));

      const { error } = await supabase
        .from('personas')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: "Order updated",
        description: "Your preferred order has been saved",
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to save the new order",
        variant: "destructive"
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(p => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onEdit={() => onEdit(persona)}
              onDelete={() => onDelete(persona.id)}
              selectionMode={selectionMode}
              selected={selectedPersonas.some(p => p.id === persona.id)}
              onSelect={onSelect ? (selected) => onSelect(persona, selected) : undefined}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
