"use client";

import { motion } from "motion/react";
import { editorialEase, revealViewport } from "@/lib/motion";

const quote =
  "Fashion in India is not a trend. It is a language. We are building Populr to make sure the right voices are heard.";

export function Manifesto() {
  return (
    <section className="bg-[var(--color-primary)] py-[var(--space-section)] text-[var(--color-ivory)]">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.7, ease: editorialEase }}
        className="section-shell text-center"
      >
        <p className="mx-auto max-w-[720px] text-[clamp(30px,4.1vw,50px)] leading-[1.2] font-[var(--font-serif)]">
          {quote.split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              initial={{ opacity: 0.25 }}
              whileInView={{ opacity: 1 }}
              viewport={revealViewport}
              transition={{ duration: 0.45, ease: editorialEase, delay: index * 0.02 }}
              className="mr-2 inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>
        <p className="mt-8 text-[13px] uppercase tracking-[0.1em] text-[var(--color-primary-100)]">
          — The Populr Team
        </p>
      </motion.div>
    </section>
  );
}
