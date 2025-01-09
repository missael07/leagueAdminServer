import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';

@Entity('Branches')
export class Branch {
  @PrimaryGeneratedColumn()
  branchId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'boolean' })
  status: boolean;
}