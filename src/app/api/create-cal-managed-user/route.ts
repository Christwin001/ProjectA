import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(req: Request) {
  const {
    name,
    email,
    userId,
    timeZone,
    timeFormat = 24,
    weekStart = "Monday",
  } = await req.json();

  const result = await fetch(
    `${process.env.CAL_API_URL ?? ""}/oauth-clients/${
      process.env.CAL_CLIENT_ID
    }/users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cal-secret-key": process.env.CAL_SECRET_KEY ?? "",
      },
      body: JSON.stringify({
        name,
        email,
        timeZone,
        weekStart,
        timeFormat,
      }),
    }
  );

  if (!result.ok) {
    return new Response(`Error`, {
      status: result.status,
      statusText: result.statusText,
    });
  }

  const { data } = await result.json();

  await redis.hset(userId, {
    id: data.user.id,
    username: data.user.username,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });

  return Response.json({ success: true });
}
