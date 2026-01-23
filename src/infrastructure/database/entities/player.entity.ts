
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('players')
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  position: string;

  @Column({ default: false })
  isForSale: boolean;

  @Column({ nullable: true })
  askingPrice: number;

  @ManyToOne(() => TeamEntity, team => team.players)
  team: TeamEntity;

  @Column()
  teamId: number;
}
