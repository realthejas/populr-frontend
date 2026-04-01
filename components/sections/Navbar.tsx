"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Button } from "@/components/ui/Button";
import { editorialEase } from "@/lib/motion";

export function Navbar() {
  const [elevated, setElevated] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => setElevated(latest > 20));

  return (
    <>
      <motion.nav
        animate={{
          backgroundColor: elevated ? "rgba(250, 248, 245, 0.9)" : "rgba(250, 248, 245, 0.72)",
          borderBottomColor: elevated ? "rgba(120, 113, 108, 0.24)" : "rgba(120, 113, 108, 0)",
        }}
        transition={{ duration: 0.2, ease: editorialEase }}
        className="fixed inset-x-0 top-0 z-50 h-16 border-b backdrop-blur-md"
      >
        <div className="section-shell flex h-full items-center justify-between">
          <a href="#" className="font-[var(--font-serif)] text-[22px] tracking-[0.12em] text-[var(--color-primary)]">
            POPULR
          </a>
          <div className="hidden md:block">
            <Button
              className="h-11 rounded-full px-5 text-sm font-semibold transition-transform duration-150 hover:scale-[0.98]"
            >
              <a href="#waitlist">Join Waitlist</a>
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
