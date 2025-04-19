import Redis from "ioredis";

let redis: Redis;

export const initRedis = () => {
  if (redis) return redis;
  redis = new Redis(process.env.REDIS_URL || "");
  return redis;
};
