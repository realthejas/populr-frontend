"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { editorialEase } from "@/lib/motion";
import { waitlistEmailSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

const heroVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: editorialEase } },
};

type WaitlistRole = "buyer" | "seller";

function RoleArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 5v14M12 19l-4-4M12 19l4-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Hero() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<WaitlistRole>("buyer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const parsed = waitlistEmailSchema.safeParse(email);
    if (!parsed.success) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data, role, source: "landing_hero" }),
      });
      const data = (await response.json()) as { message?: string };

      if (response.status === 201) {
        setSuccess(true);
        setMessage("You're on the list. We'll be in touch.");
        setEmail("");
        return;
      }

      if (response.status === 409) {
        setError("You're already on the list!");
        return;
      }

      setError(data.message ?? "Something went wrong. Try again.");
    } catch {
      setError("Network issue. Please try once more.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="waitlist" className="grain-overlay relative flex min-h-[100svh] items-center pt-16">
      <div className="section-shell w-full py-14 md:py-20">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-2xl flex-col justify-center"
        >
          <motion.p variants={itemVariants} className="label mb-6 text-[var(--color-primary)]">
            Coming to India
          </motion.p>
          <motion.h1 variants={itemVariants} className="h1-type">
            Something worth waiting for.
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 max-w-xl text-[18px] leading-[1.75] text-[var(--color-secondary)]">
            We&apos;re not ready to say more yet. Drop your email and we&apos;ll reach you when the
            door opens.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-4">
            <motion.div
              className="flex flex-wrap items-center gap-3 text-[var(--color-tertiary)]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: editorialEase, delay: 0.35 }}
            >
              <motion.span
                className="inline-flex text-[var(--color-primary)]"
                animate={{ y: [0, 5, 0], opacity: [1, 0.72, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <RoleArrowIcon className="shrink-0" />
              </motion.span>
              <span className="text-sm font-medium tracking-tight text-[var(--color-secondary)]">
                Select your role
              </span>
            </motion.div>

            <div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
              role="group"
              aria-label="Select your role"
            >
              <div className="hero-role-toggle" data-state={role}>
                <span aria-hidden className="hero-role-toggle__thumb" />
                <div className="hero-role-toggle__segments">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRole("buyer")}
                    aria-pressed={role === "buyer" ? "true" : "false"}
                    className="hero-role-toggle__opt hero-role-toggle__opt--buyer"
                  >
                    Buyer
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRole("seller")}
                    aria-pressed={role === "seller" ? "true" : "false"}
                    className="hero-role-toggle__opt hero-role-toggle__opt--seller"
                  >
                    Seller
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={onSubmit}
            className="mt-6 flex flex-col gap-3 md:flex-row"
          >
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              placeholder="Enter your email"
              className="h-11 rounded-full px-4 md:max-w-[340px] placeholder:text-[var(--color-secondary)]"
            />
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-primary)] px-5 text-sm font-semibold text-[var(--color-ivory)]"
                >
                  ✓ Joined
                </motion.div>
              ) : (
                <motion.div key="button" layout>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    disabled={loading}
                    className={cn(
                      "h-11 min-h-11 shrink-0 rounded-full px-6 text-sm font-semibold",
                      "transition-transform duration-150 hover:scale-[0.98] active:scale-[0.98] active:translate-y-0",
                    )}
                  >
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-ivory)] border-t-transparent" />
                        Joining...
                      </span>
                    ) : (
                      "Join the Waitlist"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
          {error ? <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p> : null}
          {message ? <p className="mt-2 text-sm text-[var(--color-secondary)]">{message}</p> : null}
          <motion.p variants={itemVariants} className="mt-4 text-[13px] text-[var(--color-secondary)]">
            Thousands already on the list.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
