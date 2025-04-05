import { useState, useEffect, useRef } from 'react';

type Size = {
  width: number;
  height: number;
};

export function useResizeObserver<T extends HTMLElement>(
  ref: React.RefObject<T>
): Size {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return size;
}
