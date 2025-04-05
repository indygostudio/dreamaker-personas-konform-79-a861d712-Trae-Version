import { useState, useEffect, useRef, RefObject } from 'react';

interface Size {
  width?: number;
  height?: number;
}

export function useResizeObserver<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>
): Size {
  const [size, setSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  // Using a ref to store the ResizeObserver instance
  const observer = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Cleanup previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new ResizeObserver
    observer.current = new ResizeObserver(entries => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      
      // Only update if values have actually changed
      setSize(prevSize => {
        if (prevSize.width !== width || prevSize.height !== height) {
          return { width, height };
        }
        return prevSize;
      });
    });

    // Start observing the element
    observer.current.observe(ref.current);

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [ref]);

  return size;
}
