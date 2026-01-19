
import { Worker } from 'bullmq';
import { DataSource } from 'typeorm';
import { TeamEntity } from '../../infrastructure/database/entities/team.entity';
import { PlayerEntity } from '../../infrastructure/database/entities/player.entity';

export function startTeamWorker(dataSource: DataSource) {
  new Worker(
    'team-creation',
    async job => {
      const { userId } = job.data;

      console.log('Creating team for user', userId);

      const teamRepo = dataSource.getRepository(TeamEntity);
      const playerRepo = dataSource.getRepository(PlayerEntity);

      // create team
      const team = teamRepo.create({
        budget: 5_000_000,
        status: 'READY',
        user: { id: userId } as any,
      });

      await teamRepo.save(team);

      // generate players
      const players = [];

      const generate = (pos: string, count: number) => {
        for (let i = 0; i < count; i++) {
          players.push(
            playerRepo.create({
              name: `${pos}_${i + 1}`,
              position: pos,
              team,
            }),
          );
        }
      };

      generate('GK', 3);
      generate('DEF', 6);
      generate('MID', 6);
      generate('ATT', 5);

      await playerRepo.save(players);

      console.log('Team created for user', userId);
    },
    {
      connection: { host: 'localhost', port: 6379 },
    },
  );
}
