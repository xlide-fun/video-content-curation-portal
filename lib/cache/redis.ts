import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis =
  url && token
    ? new Redis({ url, token })
    : null;

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return (await redis.get(key)) as T | null;
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 3600) {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {}
}

export async function markKeyDegraded(keyId: string, seconds = 60) {
  if (!redis) return;
  try {
    await redis.set(`degraded:${keyId}`, '1', { ex: seconds });
  } catch {}
}

export async function isKeyDegraded(keyId: string): Promise<boolean> {
  if (!redis) return false;
  try {
    return Boolean(await redis.get(`degraded:${keyId}`));
  } catch {
    return false;
  }
}
