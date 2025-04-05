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

  const calUserId = await redis.hget(userId, "id");
  const calUsername = await redis.hget(userId, "username");

  if (!calUserId || !calUsername) {
    return new Response("User not found", {
      status: 404,
    });
  }

  return Response.json({ userId: calUserId, username: calUsername });
}
