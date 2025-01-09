import { Team } from "src/teams/entities/team.entity";

export interface UserResponse {
    id: number;
    userName: string;
    name: string;
    role: string;
    email: string;
    createdBy: string;
    isActive: boolean;
    teams: Team[]
}