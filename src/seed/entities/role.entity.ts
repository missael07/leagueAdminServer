import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'boolean' })
  isActive: boolean;
}
