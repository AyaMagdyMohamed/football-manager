import { Queue } from 'bullmq';

export const teamQueue = new Queue('team-creation', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});