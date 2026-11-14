"use client";

import { useEffect, useRef, useState } from "react";

// Paginate to the space actually available, including after browser zoom or resizing.
export function usePageCapacity(rowHeight = 52, maximum = 6, gap = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [capacity, setCapacity] = useState(3);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const style = window.getComputedStyle(element);
      const height = element.clientHeight - parseFloat(style.paddingTop || "0") - parseFloat(style.paddingBottom || "0");
      setCapacity(Math.max(1, Math.min(maximum, Math.floor((height + gap) / (rowHeight + gap)))));
    };
    measure();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [maximum, rowHeight, gap]);
  return { ref, capacity };
}
