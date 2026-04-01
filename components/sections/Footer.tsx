"use client";

import { motion } from "motion/react";
import { editorialEase, revealViewport } from "@/lib/motion";

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: 0.7, ease: editorialEase }}
      className="border-t border-[var(--color-secondary-200)] py-10"
    >
      <div className="section-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-[var(--font-serif)] text-xl tracking-[0.12em] text-[var(--color-primary)]">POPULR</p>
            <p className="mt-3 text-[13px] text-[var(--color-secondary)]">
              © 2026 Populr Technologies Pvt. Ltd.
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--color-secondary)]">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="mailto:hello@bepopulr.com">Contact</a>
            <a href="#" aria-label="Instagram">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 4L20 20" strokeWidth="1.5" />
                <path d="M20 4L4 20" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </div>
        <p className="mt-10 text-center font-[var(--font-serif)] text-2xl italic">
          Something remarkable is coming.
        </p>
        <p className="mt-3 text-center text-sm text-[var(--color-secondary)]">bepopulr.com · bepopulr.in</p>
      </div>
    </motion.footer>
  );
}
