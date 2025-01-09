import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'integer' })
  value: number;

  @Column({ type: 'boolean' })
  status: boolean;
}