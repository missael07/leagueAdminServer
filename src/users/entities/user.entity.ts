import { Role } from "src/seed/entities/role.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'text' })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'text' })
    firstName: string;

    @Column({ type: 'text' })
    lastName: string;
    
    @Column({ type: 'text' })
    phoneNumber: string;

    @ManyToOne(() => Role, (role) => role)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ type: 'integer' })
    failedLoginAttempts: number;

    @Column({ type: 'boolean' })
    isLocked: boolean;

    @Column({ type: 'timestamp', nullable: true })
    lockUntil: Date;


    @BeforeInsert()
    checkFieldsBeforeInser() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.email = this.email.toLowerCase().trim();
    }
}
