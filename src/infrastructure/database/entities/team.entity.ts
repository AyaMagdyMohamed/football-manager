
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PlayerEntity } from './player.entity';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  budget: number;

  @Column()
  status: string;

  @Column()
  name: string;

  @OneToOne(() => UserEntity, user => user.team)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => PlayerEntity, p => p.team)
  players: PlayerEntity[];


}
