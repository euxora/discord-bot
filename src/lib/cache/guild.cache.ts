import type { Redis } from 'ioredis';
import type { PrismaClient } from '@prisma/client';

const PREFIX_TTL = 3600;

export function guildCacheKey(guildId: string): string {
  return `guild:${guildId}:prefix`;
}

export async function getCachedPrefix(
  redis: Redis,
  prisma: PrismaClient,
  guildId: string,
): Promise<string> {
  const key = guildCacheKey(guildId);

  const cached = await redis.get(key);
  if (cached !== null) return cached;

  const guild = await prisma.guild.findUnique({
    where: { id: guildId },
    select: { prefix: true },
  });

  const prefix = guild?.prefix ?? 'e!';
  await redis.set(key, prefix, 'EX', PREFIX_TTL);
  return prefix;
}

export async function invalidatePrefixCache(redis: Redis, guildId: string): Promise<void> {
  await redis.del(guildCacheKey(guildId));
}
