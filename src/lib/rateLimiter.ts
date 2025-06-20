import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

export const autocompleteLimiter = new RateLimiterMemory({
  points: 30,
  duration: 10,
});

export const searchLimiter = new RateLimiterMemory({
  points: 15,
  duration: 10,
});

export const handleRateLimitError = () => {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": "10",
        "X-RateLimit-Remaining": "0",
      },
    }
  );
};
