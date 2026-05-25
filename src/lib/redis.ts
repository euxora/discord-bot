import { Redis } from 'ioredis';
import { config } from '#config';

export const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null, // requerido por BullMQ
  enableReadyCheck: false,
  lazyConnect: true,
});

redis.on('error', (err) => {
  console.error('[Redis] connection error:', err);
});
