import { Team } from "src/teams/entities/team.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('Rosters')
export class Roster {
        @PrimaryGeneratedColumn()
        rosterId: number;

        @Column({ type: 'text' })
        firstName: string;

        @Column({ type: 'text' })
        lastName: string;

        @Column({ type: 'text' })
        imgUrl: string;

        @Column({ type: 'boolean', default: false })
        blockedToPlay: boolean;

        @Column({ type: 'boolean', default: false })
        blockedToPitch: boolean;

        @Column({ type: 'boolean', default: false })
        isReinforcement: boolean;

        @Column({ type: 'text' })
        createdBy: string;

        @Column({ type: 'timestamptz' })
        createdDate: Date;

        @Column({ type: 'text', nullable: true })
        updatedBy: string;

        @Column({ type: 'timestamptz', nullable: true })
        updatedDate: Date;

        @ManyToOne(() => Team, (team) => team.rosters)
        @JoinColumn({ name: 'teamId' })
        team: Team;

}
