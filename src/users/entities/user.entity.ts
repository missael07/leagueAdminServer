import { Role } from "src/seed/entities/role.entity";
import { Team } from "src/teams/entities/team.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    userName: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    firstName: string;

    @Column({ type: 'text' })
    lastName: string;
    
    @Column({ type: 'text' })
    phoneNumber: string;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ type: 'integer', default: 0 })
    failedLoginAttempts: number;

    @Column({ type: 'boolean', default: false })
    isLocked: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lockUntil: Date;

    @Column({ type: 'text' })
    createdBy: string;

    @Column({ type: 'timestamptz' })
    createdDate: Date;

    @Column({ type: 'text', nullable: true })
    updatedBy: string;

    @Column({ type: 'timestamptz', nullable: true })
    updatedDate: Date;

    @ManyToMany(() => Team, (team) => team.managers)
    @JoinTable() // Indica que esta entidad manejará la tabla intermedia
    teams: Team[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
    }
}
