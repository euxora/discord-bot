import type { CaseType } from '@prisma/client';

export interface ModerationJobData {
  type: 'unban' | 'unmute';
  guildId: string;
  userId: string;
  caseId: number;
  caseType: CaseType;
}

export interface NotificationJobData {
  channelId: string;
  content: string;
  embeds?: unknown[];
}
