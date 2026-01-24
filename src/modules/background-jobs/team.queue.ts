import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

export const teamQueue = (config: ConfigService) => {
  return new Queue(config.get('TEAM_QUEUE_NAME'), {
    connection: {
      host: config.get('REDIS_HOST'),
      port: config.get<number>('REDIS_PORT'),
    },
  });
};