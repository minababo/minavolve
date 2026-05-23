"use client";

import { useEffect, useRef, useState } from "react";

type StatNumberProps = {
  value: number;
  duration?: number;
};

export function StatNumber({ value, duration = 800 }: StatNumberProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (value === 0) {
      rafRef.current = requestAnimationFrame(() => setDisplayed(0));
      return () => cancelAnimationFrame(rafRef.current);
    }

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(eased * value));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  return <>{displayed}</>;
}
