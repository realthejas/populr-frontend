import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { waitlistRequestSchema } from "@/lib/validations";

export const runtime = "edge";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "waitlist",
});

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = waitlistRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
    }

    const ip = clientIp(req);
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { message: "Too many requests from this IP. Please try later." },
        { status: 429 },
      );
    }

    const supabase = getSupabaseServerClient();
    const userAgent = req.headers.get("user-agent") || "unknown";
    const source = parsed.data.source ?? "landing_hero";
    const { error } = await supabase.from("waitlist_emails").insert({
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      source,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (error) {
      const logPayload: Record<string, unknown> = {
        code: error.code,
        message: error.message,
      };
      if (process.env.NODE_ENV === "development") {
        logPayload.details = error.details;
        logPayload.hint = error.hint;
      }
      console.error("[waitlist] insert failed", logPayload);
      if (error.code === "23505") {
        return NextResponse.json({ message: "Already registered" }, { status: 409 });
      }
      return NextResponse.json(
        {
          message:
            process.env.NODE_ENV === "development"
              ? `Unable to save your signup: ${error.message}`
              : "Unable to save your signup",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    console.error("[waitlist] unexpected error", error);
    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV === "development"
            ? `Unexpected server error: ${error instanceof Error ? error.message : "unknown error"}`
            : "Unexpected server error",
      },
      { status: 500 },
    );
  }
}
