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

  const accessToken = await redis.hget(userId, "accessToken");

  if (!accessToken) {
    return new Response("Access token not found", {
      status: 404,
    });
  }

  return Response.json({ accessToken });
}
