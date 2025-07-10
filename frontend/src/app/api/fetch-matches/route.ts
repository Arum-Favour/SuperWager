import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { buildMatchesUrl } from "@/utils/utils";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1m"),
  analytics: true,
});

export async function GET(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
  const { success } = await rateLimit.limit(ip);
  if (!success)
    return new NextResponse(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
    });

  const season_id = request.nextUrl.searchParams.get("season_id");
  if (!season_id)
    return new NextResponse(JSON.stringify({ error: "Missing season_id" }), {
      status: 400,
    });

  try {
    const res = await axios.get(buildMatchesUrl(season_id), {
      headers: {
        accept: "application/json",
        "x-api-key": process.env.SPORTRADAR_API_KEY,
      },
    });
    return new NextResponse(JSON.stringify(res.data), { status: 201 });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: error?.message || "Failed to fetch matches" }),
      { status: 500 }
    );
  }
}
