import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Menu } from './menu.entity';

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

  @ManyToMany(() => Menu, (menu) => menu.roles)
  menus: Menu[];
}
