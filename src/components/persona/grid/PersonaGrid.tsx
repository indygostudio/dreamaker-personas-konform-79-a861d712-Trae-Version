
import { PersonaCard } from "@/components/PersonaCard";
import type { Persona } from "@/types/persona";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PersonaGridProps {
  personas: Persona[];
  zoomLevel: number;
  onEdit?: (persona: Persona) => void;
  onDelete?: (id: string) => void;
  calculateScale: () => string;
  getGridClass: () => string;
}

export function PersonaGrid({
  personas,
  zoomLevel,
  onEdit,
  onDelete,
  calculateScale,
  getGridClass,
}: PersonaGridProps) {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const [observer, setObserver] = useState<IntersectionObserver | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  
  // Group personas into rows based on grid class
  const getRowCount = () => {
    const gridClass = getGridClass();
    if (gridClass.includes('grid-cols-1')) return 1;
    if (gridClass.includes('grid-cols-2')) return 2;
    if (gridClass.includes('grid-cols-3')) return 3;
    if (gridClass.includes('grid-cols-4')) return 4;
    if (gridClass.includes('grid-cols-5')) return 5;
    if (gridClass.includes('grid-cols-6')) return 6;
    return 3; // Default fallback
  };
  
  // Group personas into rows
  const groupedPersonas = personas.reduce<Persona[][]>((acc, persona, index) => {
    const rowIndex = Math.floor(index / getRowCount());
    if (!acc[rowIndex]) acc[rowIndex] = [];
    acc[rowIndex].push(persona);
    return acc;
  }, []);
  
  // Setup intersection observer to detect when rows come into view
  useEffect(() => {
    if (!containerRef) return;
    
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rowId = entry.target.getAttribute('data-row-id');
          if (rowId) {
            // When a row becomes visible, also make the next row visible (spring effect)
            const rowIndex = parseInt(rowId);
            setVisibleItems(prev => {
              const newItems = [...prev];
              // Add current row
              if (!newItems.includes(`row-${rowIndex}`)) {
                newItems.push(`row-${rowIndex}`);
              }
              // Add next row (spring effect)
              if (!newItems.includes(`row-${rowIndex + 1}`)) {
                newItems.push(`row-${rowIndex + 1}`);
              }
              return newItems;
            });
          }
        }
      });
    };
    
    const newObserver = new IntersectionObserver(handleIntersect, options);
    setObserver(newObserver);
    
    return () => {
      if (newObserver) {
        newObserver.disconnect();
      }
    };
  }, [containerRef]);
  
  // Observe row elements
  useEffect(() => {
    if (!observer || !containerRef) return;
    
    // Disconnect previous observations
    observer.disconnect();
    
    // Observe all row elements
    const rowElements = containerRef.querySelectorAll('[data-row-id]');
    rowElements.forEach(el => observer.observe(el));
    
    // Make first two rows visible by default
    setVisibleItems(['row-0', 'row-1']);
    
    return () => {
      observer.disconnect();
    };
  }, [observer, containerRef, personas]);
  
  return (
    <div 
      className={`grid ${getGridClass()} p-4 min-h-[calc(100vh-280px)] w-full overflow-y-auto`}
      ref={setContainerRef}
    >
      {groupedPersonas.map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          data-row-id={rowIndex}
          className="contents"
        >
          {row.map(persona => (
            <motion.div 
              key={persona.id} 
              className={`relative ${calculateScale()}`}
              style={{ transformOrigin: 'center center' }}
              initial={{ opacity: 0, y: 20 }}
              animate={visibleItems.includes(`row-${rowIndex}`) ? 
                { opacity: 1, y: 0 } : 
                { opacity: 0, y: 20 }
              }
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                delay: 0.05 * (rowIndex % 2 === 0 ? 0 : 1) // Stagger effect within row
              }}
            >
              <PersonaCard
                persona={persona}
                onEdit={() => onEdit?.(persona)}
                onDelete={() => onDelete?.(persona.id)}
                selectionMode={false}
              />
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
