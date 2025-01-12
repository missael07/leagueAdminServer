import { TeamResponse } from "src/teams/interfaces/responseTeam.interface";

export interface UserResponse {
    id: number;
    userName: string;
    name: string;
    role: string;
    email: string;
    createdBy: string;
    isActive: boolean;
    team: string[];
    phoneNumber: string;
}