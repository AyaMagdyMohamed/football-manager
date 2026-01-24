export const queueConfig = () => ({
  teamQueueName: process.env.TEAM_QUEUE_NAME || 'team-creation',
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
