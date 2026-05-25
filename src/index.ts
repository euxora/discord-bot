import 'dotenv/config';
import { EuxoraClient } from './lib/EuxoraClient.js';
import { config } from './config.js';

const client = new EuxoraClient();

const gracefulShutdown = async (signal: string): Promise<void> => {
  client.logger.info(`Received ${signal}, shutting down gracefully...`);
  await client.destroy();
  process.exit(0);
};

process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  client.logger.fatal('Unhandled rejection:', reason);
});

await client.login(config.DISCORD_TOKEN);
