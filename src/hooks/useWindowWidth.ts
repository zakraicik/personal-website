"use client";

import { useEffect, useState } from "react";

interface UseWindowWidthOptions {
  debounceMs?: number;
}

export function useWindowWidth(options: UseWindowWidthOptions = {}) {
  const { debounceMs = 0 } = options;
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const setCurrentWidth = () => {
      setWidth(window.innerWidth);
    };

    const handleResize = () => {
      if (debounceMs > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(setCurrentWidth, debounceMs);
        return;
      }

      setCurrentWidth();
    };

    window.addEventListener("resize", handleResize);
    setCurrentWidth();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [debounceMs]);

  return width;
}
