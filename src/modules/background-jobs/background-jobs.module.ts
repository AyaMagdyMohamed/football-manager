import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { teamQueue } from './team.queue';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'TEAM_QUEUE',
      useFactory: (config: ConfigService) => teamQueue(config),
      inject: [ConfigService],
    },
  ],
  exports: ['TEAM_QUEUE'],
})
export class BackgroundJobsModule {}
