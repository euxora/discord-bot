import { Queue, Worker, type Job } from 'bullmq';
import { redis } from '#redis';
import type { ModerationJobData } from './types.js';

export const moderationQueue = new Queue<ModerationJobData>('moderation', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

export function createModerationWorker(
  processor: (job: Job<ModerationJobData>) => Promise<void>,
): Worker<ModerationJobData> {
  return new Worker<ModerationJobData>('moderation', processor, {
    connection: redis,
    concurrency: 5,
  });
}
