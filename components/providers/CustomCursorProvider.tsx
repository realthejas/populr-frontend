"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

type CursorContextValue = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

const CursorContext = createContext<CursorContextValue>({
  expanded: false,
  setExpanded: (value: boolean) => {
    void value;
  },
});

export function useCursorState() {
  return useContext(CursorContext);
}

export function CustomCursorProvider({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();
    media.addEventListener("change", sync);

    let raf = 0;
    const onMove = (event: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPosition({ x: event.clientX, y: event.clientY }));
    };

    if (media.matches) window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      media.removeEventListener("change", sync);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [data-cursor='interactive']");
      setExpanded(Boolean(interactive));
    };
    window.addEventListener("mouseover", onOver);
    return () => window.removeEventListener("mouseover", onOver);
  }, [enabled]);

  const value = useMemo(() => ({ expanded, setExpanded }), [expanded]);

  return (
    <CursorContext.Provider value={value}>
      {children}
      {enabled ? (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[120] hidden -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-primary)] md:block"
          animate={{
            x: position.x,
            y: position.y,
            width: expanded ? 40 : 20,
            height: expanded ? 40 : 20,
          }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : null}
    </CursorContext.Provider>
  );
}
