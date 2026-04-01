import { z } from "zod";


export const waitlistRequestSchema = z.object({
  email: z.email(),
  role: z.enum(["buyer", "seller"]),
  source: z.string().trim().min(2).max(60).optional(),
});

export const waitlistEmailSchema = z.email("Please enter a valid email address.");

export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>;
