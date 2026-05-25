import { container } from '@sapphire/framework';
import type { Job } from 'bullmq';
import type { ModerationJobData } from '#queues/types';

export async function handleModerationJob(job: Job<ModerationJobData>): Promise<void> {
  const { type, guildId, userId, caseId } = job.data;

  const guild = await container.client.guilds.fetch(guildId).catch(() => null);
  if (!guild) {
    container.logger.warn(`[ModerationWorker] guild ${guildId} not found, skipping job ${job.id}`);
    return;
  }

  switch (type) {
    case 'unban': {
      await guild.bans.remove(userId, `Case #${caseId}: temporary ban expired`);
      await container.prisma.case.update({ where: { id: caseId }, data: { active: false } });
      container.logger.info(`[ModerationWorker] unbanned ${userId} in ${guildId}`);
      break;
    }
    case 'unmute': {
      const member = await guild.members.fetch(userId).catch(() => null);
      if (member) {
        await member.timeout(null, `Case #${caseId}: temporary mute expired`);
        await container.prisma.case.update({ where: { id: caseId }, data: { active: false } });
      }
      container.logger.info(`[ModerationWorker] unmuted ${userId} in ${guildId}`);
      break;
    }
    default:
      container.logger.warn(`[ModerationWorker] unknown job type: ${String(type)}`);
  }
}
