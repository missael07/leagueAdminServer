import { Roster } from "src/rosters/entities/roster.entity";
import { Branch } from "src/seed/entities/branch.entity";
import { Category } from "src/seed/entities/category.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Teams')
export class Team {
    @PrimaryGeneratedColumn()
    teamId: number;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @Column({ type: 'boolean', default: false })
    isPaid: boolean;

    @Column({ type: 'text' })
    createdBy: string;

    @Column({ type: 'timestamptz' })
    createdDate: Date;

    @Column({ type: 'text', nullable: true })
    updatedBy: string;

    @Column({ type: 'timestamptz', nullable: true })
    updatedDate: Date;

    @ManyToOne(() => Category, (category) => category)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ManyToOne(() => Branch, (branch) => branch)
    @JoinColumn({ name: 'branchId' })
    branch: Branch;

    @OneToMany(() => Roster, (roster) => roster.team)
    @JoinColumn({ name: 'rosterId' })
    rosters: Roster[];

    @ManyToMany(() => User, (user) => user.teams)
    @JoinTable({
        name: 'UsersTeams',
        joinColumn: {
            name: 'teamId',
            referencedColumnName: 'teamId',
        },
        inverseJoinColumn: {
            name: 'userId',
            referencedColumnName: 'userId',
        },
    })
    managers: User[];
}
