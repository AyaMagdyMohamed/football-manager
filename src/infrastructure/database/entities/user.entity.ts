
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => TeamEntity, team => team.user)
  team: TeamEntity;
}
