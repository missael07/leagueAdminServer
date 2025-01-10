import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity('Menus')
export class Menu {

    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    menuId: number;

    @Column('text')
    menuName: string;

    @Column('text')
    route: string;

    @Column('text')
    icon: string;

    @ManyToMany(() => Role, (role) => role.menus)
    @JoinTable({
        name: 'MenuRoles',
        joinColumn: {
            name: 'menuId',
            referencedColumnName: 'menuId',
        },
        inverseJoinColumn: {
            name: 'roleId',
            referencedColumnName: 'roleId',
        },
    })
    roles: Role[];
}
