import { Role } from "src/common/enums/roles/role.enum";
import { TeamResponse } from "src/teams/interfaces/responseTeam.interface";

export interface UserResponse {
    id: number;
    userName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    role: Role;
    roleName: string;
    email: string;
    createdBy: string;
    isActive: boolean;
    team: string[];
    teamIds: number[];
    phoneNumber: string;
}