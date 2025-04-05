import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return new Response("User ID is required", {
      status: 400,
    });
  }

  const refreshToken = await redis.hget(userId, "refreshToken");

  if (refreshToken) {
    const response = await fetch(
      `${process.env.CAL_API_URL ?? ""}/oauth/${
        process.env.CAL_CLIENT_ID ?? ""
      }/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cal-secret-key": process.env.CAL_SECRET_KEY ?? "",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );
    if (response.status === 200) {
      const resp = await response.json();
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        resp.data;

      await redis.hset(userId, {
        refreshToken: (newRefreshToken as string) ?? "",
        accessToken: (newAccessToken as string) ?? "",
      });

      return Response.json({ accessToken: newAccessToken });
    }

    return new Response("Error refreshing token", {
      status: 500,
      statusText: response.statusText,
    });
  }

  return new Response("Refresh token not found", {
    status: 404,
  });
}
