import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('PlayerTypes')
export class PlayerType {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  playerTypeId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'text' })
  status: string;
}
